const express = require('express');
const router = express.Router();
const feeController = require('../controllers/feeController');
const { verifyToken, isAdmin } = require('../middleware/authMiddleware');

// Admin routes
router.post('/invoice', verifyToken, isAdmin, feeController.generateInvoice);
router.get('/stats', verifyToken, isAdmin, feeController.getRevenueStats);

// Student/Admin routes
router.post('/pay/:feeId', verifyToken, feeController.payFees);
router.get('/student/:studentId', verifyToken, feeController.getStudentFees);

module.exports = router;