const { Pool } = require('pg');
const dbConfig = require('../config/dbConfig');
const moment = require('moment-timezone');


const pool = new Pool(dbConfig);
// Define controller functions for each endpoint
async function getAllUsers(req, res) {
    try {
        const client = await pool.connect();
        const query = 'SELECT * FROM public."Users"';
        const result = await client.query(query);
        client.release(); // Release the client back to the pool
    
        if (result.rows.length > 0) {
          res.status(200).json({ users: result.rows, message: 'Data found' });
        } else {
          res.status(200).json({ message: 'No data found' });
        }
      } catch (error) {
        res.status(500).json({ message: error.message });
      }
    }
    

    async function getAllUsersLocation(req, res) {
        try {
            const client = await pool.connect();
            const query = 'SELECT "Id", "UserName", "latitude", "longitude", "pingTime" FROM public."Users" WHERE "latitude" IS NOT NULL AND "longitude" IS NOT NULL';
            const result = await client.query(query);
            client.release(); // Release the client back to the pool
        
            if (result.rows.length > 0) {
              res.status(200).json({ users: result.rows, message: 'Data found' });
            } else {
              res.status(200).json({ message: 'No data found' });
            }
          } catch (error) {
            res.status(500).json({ message: error.message });
          }
        }


        async function updateUserLocation(req, res) {
            const { latitude, longitude, pingTime, userId} = req.body;
            console.log(userId);
            try {
                // Get the current local time
              const localTime = moment().format('YYYY-MM-DD HH:mm:ssZ');

              const client = await pool.connect();
              const query = 'UPDATE public."Users" SET "latitude"=$1, "longitude"=$2, "pingTime"=$3 WHERE "Id"=$4';
              const result = await client.query(query, [latitude, longitude, localTime, userId]);
              client.release();
          
              if (result.rowCount > 0) {
                res.status(200).json({ message: 'User location updated successfully' });
              } else {
                res.status(404).json({ message: 'User not found' });
              }
            } catch (error) {
              res.status(500).json({ message: error.message });
            }
          }

          async function updateUserLocationHistory(req, res){
            const { latitude, longitude, pingTime, userId } = req.body;
            console.log(userId);

            try{
              // Get the current local time
              const localTime = moment().format('YYYY-MM-DD HH:mm:ssZ');

              const client = await pool.connect();

              // Query the old history value from the UserLocations table
              const historyQuery = 'SELECT "latitude", "longitude" FROM public."UserLocations" WHERE "UserId" = $1 ORDER BY "updatedAt" DESC LIMIT 1';
              const historyResult = await client.query(historyQuery, [userId]);

            console.log("Selected");

              if (historyResult.rowCount > 0) {
                const oldLatitude = historyResult.rows[0].latitude;
                const oldLongitude = historyResult.rows[0].longitude;

                // Calculate the distance between old and new coordinates (you can use a distance calculation algorithm here)

                // Example usage
                const distance = calculateDistanceMeters(oldLatitude, oldLongitude, latitude, longitude);
                console.log(`Calculated Distance: ${distance}`); // Output distance in kilometers

                // If distance > 500 meters, create a new record in UserLocations table
                if (distance > 500) {
                  console.log("Inserting");

                  const insertQuery = 'INSERT INTO public."UserLocations" ("UserId", "latitude", "longitude", "updatedAt") VALUES ($1, $2, $3, $4)';
                  const insertResult = await client.query(insertQuery, [userId, latitude, longitude, localTime]);
                }
              } else {
                const insertQuery = 'INSERT INTO public."UserLocations" ("UserId", "latitude", "longitude", "updatedAt") VALUES ($1, $2, $3, $4)';
                const insertResult = await client.query(insertQuery, [userId, latitude, longitude, localTime]);
              }
              console.log("Inserted and now Updating");

              // Update the Users table with the new location
              const updateQuery = 'UPDATE public."Users" SET "latitude"=$1, "longitude"=$2, "pingTime"=$3 WHERE "Id"=$4';
              const updateResult = await client.query(updateQuery, [latitude, longitude, localTime, userId]);
              console.log("Updated");

              client.release();

              if (updateResult.rowCount > 0) {
                res.status(200).json({ message: 'User location updated successfully' });
              } else {
                res.status(404).json({ message: 'User not found' });
              }

            } catch (error) {
              res.status(500).json({ message: error.message });
            }
          }

          async function getUserLocationHistory(req, res) {
            const userId = req.query.userId;
            const date = req.query.date;
            // Assuming the date is passed as a parameter in the format 'YYYY-MM-DD'

            try {
              const client = await pool.connect();
              const query = 'SELECT "latitude", "longitude", "updatedAt" FROM "UserLocations" WHERE "UserId" = $1 AND DATE("updatedAt") = $2 ORDER BY "updatedAt" DESC';
              const result = await client.query(query, [userId, date]);
              client.release();
          
              if (result.rowCount > 0) {
                res.status(200).json({ locations: result.rows });
              } else {
                res.status(404).json({ message: 'No locations found for the specified user and date' });
              }
            } catch (error) {
              res.status(500).json({ message: error.message });
            }
          }

          // Calculating the Distance in KiloMeters
          function calculateDistanceKilometers(lat1, lon1, lat2, lon2) {
            const R = 6371; // Radius of the Earth in kilometers
            const dLat = deg2rad(lat2 - lat1);
            const dLon = deg2rad(lon2 - lon1);
            const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) + Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) * Math.sin(dLon / 2) * Math.sin(dLon / 2);
            const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
            const distance = R * c; // Distance in kilometers
            return distance;
          }

          // Converting Degree to Rad 
          function deg2rad(deg) {
            return deg * (Math.PI / 180);
          }
          
          // Calculating the Distance in Meters
          function calculateDistanceMeters(lat1, lon1, lat2, lon2) {
            const R = 6371e3; // Earth's radius in meters
            const φ1 = (lat1 * Math.PI) / 180; // φ, λ in radians
            const φ2 = (lat2 * Math.PI) / 180;
            const Δφ = ((lat2 - lat1) * Math.PI) / 180;
            const Δλ = ((lon2 - lon1) * Math.PI) / 180;
          
            const a =
              Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
              Math.cos(φ1) * Math.cos(φ2) * Math.sin(Δλ / 2) * Math.sin(Δλ / 2);
            const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
          
            const distance = R * c; // Distance in meters
            return distance;
          }
          



module.exports = {
    getAllUsers,
    getAllUsersLocation,
    updateUserLocation,
    updateUserLocationHistory,
    getUserLocationHistory
};