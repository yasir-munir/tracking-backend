const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const { verifyToken, authenticate } = require('../middleware/authMiddleware');

// Define route handlers for each endpoint
router.get('/all-users', authenticate, userController.getAllUsers);
router.get('/all-locations', authenticate, userController.getAllUsersLocation);
router.post('/update-location', authenticate, userController.updateUserLocationHistory);
router.get('/get-history', authenticate, userController.getUserLocationHistory);


module.exports = router;
