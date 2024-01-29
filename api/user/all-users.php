<?php 
use Parse\ParseUser;

ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);
/**
 * Include the autoloader file from the vendor directory.
 */
require_once '../../vendor/autoload.php';
require_once '../../config/config.php';

/**
 * Import the ParseClient class from the Parse namespace.
 */
use Parse\ParseClient;
use Parse\ParseException;
use Parse\ParseQuery;


/**
 * Initializes the ParseClient with the provided app ID and master key of SmartFill.
 *
 * @param string $appID
 * @param string|null $masterKey
 * @return void
 */
ParseClient::initialize($appID, null, $masterKey);
ParseClient::setServerURL("http://" . $serverIP . ":" . $port . "/", 'parse');

/**
 * authenticateRequest
 *
 * @param  mixed $token
 * @return void
 */
function authenticateRequest($token) {
    $headers = getallheaders();
    if (!isset($headers['API-Key'])) {
        throw new Exception('Access key is missing');
    }
    
    $apiKey = $headers['API-Key']; // Assuming API key is passed in the header
    // Check if the API key is valid
    if ($apiKey !== $token) {
        throw new Exception('Unauthorized');
    }
}
    $query = new ParseQuery("_User");
    $query->equalTo("is_active", true);
    $query->equalTo("is_admin", true);

    // Retrieve all users
    try {
        $admin = $query->first(true);
    } catch (ParseException $e) {
        echo 'Error: ' . $e->getMessage();
    }
    $token = $admin->get("token");

// Authenticate the request
try {
    authenticateRequest($token);
    // Proceed with the rest of the code if authentication is successful
} catch (Exception $e) {
    http_response_code(401);
    echo json_encode(array("message" => $e->getMessage()));
    exit;
}

// Handle the API endpoints
if ($_SERVER['REQUEST_METHOD'] === 'GET') {
    // Handle GET request
    // Create a query for the User class
    $query = new ParseQuery("_User");
    $query->equalTo("is_active", true);
    $query->equalTo("is_admin", false);

    // Retrieve all users
    try {
        $allUsers = $query->find(true);
    } catch (ParseException $e) {
        echo 'Error: ' . $e->getMessage();
    }
    // Loop through the users and access their properties
    $data = array();
    foreach ($allUsers as $user) {
        // Access user properties
        $objectId = $user->getObjectId();
        $username = $user->get("username");
        $driver_name = $user->get("driver_name");
        $ping_time = $dateTime = date("d-m-Y H:i:s", ($user->get("ping_time")+18000));
        $longitude = $user->get("longitude");
        $latitude = $user->get("latitude");
        $vehical_number = $user->get("vehical_number");

        // Do something with the user data
        $response = [
            "driver_name" => $driver_name,
            "ping_time" =>$ping_time,
            "latitude" => $latitude,
            "longitude" => $longitude,
            "vehical_number" => $vehical_number
        ];
        $data[] = $response;
    }

    if (!(empty($data))) {
        http_response_code(200);
        echo json_encode(array("locations" => $data, "message" => "Data found"));
    } else {
        http_response_code(200);
        echo json_encode(array("message" => "No data found"));
    }
} else {
    http_response_code(405);
    echo json_encode(array("message" => "Method not allowed"));
}

// Check for valid API key or token


?>