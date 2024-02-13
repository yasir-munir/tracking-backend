const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const { verifyToken, authenticate } = require('../middleware/authMiddleware');

// Define route handlers for each endpoint
// router.get('/all-users', authenticate, userController.getAllUsers);
// router.get('/all-locations', authenticate, userController.getAllUsersLocation);
// router.put('/update-location/:userId', authenticate, userController.updateUserLocation);

router.get('/all-users', userController.getAllUsers);
router.get('/all-locations', userController.getAllUsersLocation);
router.post('/update-location', userController.updateUserLocation);

module.exports = router;
