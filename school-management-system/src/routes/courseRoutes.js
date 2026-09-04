const express = require('express');
const router = express.Router();
const courseController = require('../controllers/courseController');
const { verifyToken, isAdmin } = require('../middleware/authMiddleware');

// Admin routes
router.post('/', verifyToken, isAdmin, courseController.createCourse);
router.post('/assign-teacher', verifyToken, isAdmin, courseController.assignTeacher);

// Admin or Student routes
router.post('/enroll', verifyToken, courseController.enrollStudent);
router.get('/', verifyToken, courseController.getCourses);

module.exports = router;