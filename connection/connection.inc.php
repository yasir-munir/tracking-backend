<?php

session_start();

define('SERVER_PATH', $_SERVER['DOCUMENT_ROOT'] . '/');
define('SITE_PATH', 'localhost');

/**
 * Includes the configuration file.
 *
 * @param string $file The path to the configuration file.
 * @return void
 */
require_once('config.php');

/**
 * Checks if the session variable 'start_smart_fill' is set.
 * If set, it checks if the current time is greater than the 'lockout_smart_fill' time and if the 'USER_LOGIN_smart_fill' session variable is set.
 * If the 'USER_LOGIN_smart_fill' session variable is greater than or equal to 3, it unsets the variable, sets it to 1, and destroys the session.
 * It also checks if the current time is greater than the 'expire_smart_fill' time and unsets the 'USER_LOGIN_smart_fill' variable and destroys the session.
 * If the 'start_smart_fill' session variable is not set, it sets it to the current time and sets the 'lockout_smart_fill
 */
if (isset($_SESSION['start_smart_fill'])) {
	$now = time(); // Checking the time now when home page starts.

	/**
	 * Checks if the current time is greater than the lockout time and if the 'USER_LOGIN_smart_fill' session variable is set.
	 * If the 'USER_LOGIN_smart_fill' session variable is greater than or equal to 3, it is unset and set to 1, and the session is destroyed.
	 *
	 * @param int $now
	 * @param array $session
	 * @return void
	 */
	if ($now > $_SESSION['lockout_smart_fill'] && isset($_SESSION['USER_LOGIN_smart_fill'])) {
		if ($_SESSION['USER_LOGIN_smart_fill'] >= 3) {
			unset($_SESSION['USER_LOGIN_smart_fill']);
			$_SESSION['USER_LOGIN_smart_fill'] = 1;
			session_destroy();
		}
	}
	/**
	 * Checks if the current time is greater than the expiration time of the 'expire_smart_fill' session variable.
	 * If it is, the 'USER_LOGIN_smart_fill' session variable is unset and the session is destroyed.
	 *
	 * @param int $now The current time in Unix timestamp format.
	 * @param array $session The session array containing the session variables.
	 * @return void
	 */
	if ($now > $_SESSION['expire_smart_fill']) {
		unset($_SESSION['USER_LOGIN_smart_fill']);
		session_destroy();
	}

} else {
	$_SESSION['start_smart_fill'] = time(); // Taking now logged in time.
	// Ending a session in 30 minutes from the starting time.
	$_SESSION['lockout_smart_fill'] = $_SESSION['start_smart_fill'] + (5 * 60);
	$_SESSION['expire_smart_fill'] = $_SESSION['start_smart_fill'] + (11480 * 60);
	$_SESSION['USER_LOGIN_smart_fill'] = 0;
}

/**
 * Require the autoloader file to load all the classes and dependencies defined in the vendor directory.
 */

if(basename($_SERVER['PHP_SELF']) == "signin.php" ){
	require 'vendor/autoload.php';
}else{
	require '../../vendor/autoload.php';
}

/**
 * Import the ParseClient class from the Parse namespace.
 */
use Parse\ParseClient;

/**
 * Initializes the ParseClient with the provided app ID and master key.
 *
 * @param string $appID
 * @param string|null $masterKey
 * @return void
 */
ParseClient::initialize($appID, null, $masterKey);
ParseClient::setServerURL("http://" . $serverIP . ":" . $port . "/", 'parse');

/**
 * Includes the 'functions.inc.php' file.
 */

if(basename($_SERVER['PHP_SELF']) == "signin.php" ){
	require_once('dist/function/functions.inc.php');
}else{
	require_once('../function/functions.inc.php');
}
