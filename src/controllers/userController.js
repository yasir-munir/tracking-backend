const { Pool } = require('pg');
const dbConfig = require('../config/dbConfig');
const moment = require('moment-timezone');


const pool = new Pool(dbConfig);
// Define controller functions for each endpoint
// Example:
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
            const query = 'SELECT "UserName", "latitude", "longitude", "pingTime" FROM public."Users" WHERE "latitude" IS NOT NULL AND "longitude" IS NOT NULL';
            const result = await client.query(query);
            client.release(); // Release the client back to the pool
        
            if (result.rows.length > 0) {
              res.status(200).json({ locations: result.rows, message: 'Data found' });
            } else {
              res.status(200).json({ message: 'No data found' });
            }
          } catch (error) {
            res.status(500).json({ message: error.message });
          }
        }


        async function updateUserLocation(req, res) {
            const { latitude, longitude, pingTime, userId} = req.body;
          
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

module.exports = {
    getAllUsers,
    getAllUsersLocation,
    updateUserLocation
};