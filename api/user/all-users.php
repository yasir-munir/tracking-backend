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
require_once '../../function/function.php';

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

$query = new ParseQuery("_User");
$query->equalTo("is_active", true);
$query->equalTo("is_admin", true);

// Retrieve token value
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
        $ping_time = $dateTime = date("d-m-Y H:i:s", ($user->get("ping_time") + 18000));
        $longitude = $user->get("longitude");
        $latitude = $user->get("latitude");
        $vehical_number = $user->get("vehical_number");

        // create the response of user data
        $response = [
            "driver_name" => $driver_name,
            "ping_time" => $ping_time,
            "latitude" => $latitude,
            "longitude" => $longitude,
            "vehical_number" => $vehical_number
        ];
        $data[] = $response;
    }

    // generate response with data if any otherwise show data not found.
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


?>