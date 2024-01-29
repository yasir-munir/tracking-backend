<?php 

/**
 *  Check for valid API key or token

 *
 * @param  mixed $token
 * @return void
 */
function authenticateRequest($token)
{
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