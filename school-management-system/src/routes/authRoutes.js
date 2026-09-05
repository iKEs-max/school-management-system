const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const { verifyToken, isAdmin } = require('../middleware/authMiddleware');

router.post('/register', authController.register);
router.post('/login', authController.login);
router.get('/profile', verifyToken, authController.getProfile);
router.post('/seed', authController.seedDummyData); 
router.get('/users', verifyToken, isAdmin, authController.getAllUsers);

module.exports = router;