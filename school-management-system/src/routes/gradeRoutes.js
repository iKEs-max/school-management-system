const express = require('express');
const router = express.Router();
const gradeController = require('../controllers/gradeController');
const { verifyToken, isTeacherOrAdmin } = require('../middleware/authMiddleware');

// Teacher/Admin routes
router.post('/input', verifyToken, isTeacherOrAdmin, gradeController.inputGrades);
router.get('/course/:courseId', verifyToken, isTeacherOrAdmin, gradeController.getCourseGrades);

// Student route (anyone logged in can view a student's grades by ID)
router.get('/student/:studentId', verifyToken, gradeController.getStudentGrades);

module.exports = router;