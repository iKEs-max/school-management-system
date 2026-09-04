const Grade = require('../models/Grade');
const Course = require('../models/Course');
const User = require('../models/User');

// Helper function to calculate letter grade
function calculateLetterGrade(total) {
    if (total >= 80) return 'A';
    if (total >= 70) return 'B';
    if (total >= 60) return 'C';
    if (total >= 50) return 'D';
    return 'F';
}

// 1. Input or Update Grades (Teacher/Admin only)
exports.inputGrades = async (req, res) => {
    try {
        const { courseId, studentId, midtermScore, examScore } = req.body;

        // Ensure the student is actually enrolled in the course
        const course = await Course.findById(courseId);
        if (!course.students.includes(studentId)) {
            return res.status(400).json({ error: 'Student is not enrolled in this course' });
        }

        // Find existing grade or create a new one
        let grade = await Grade.findOne({ student: studentId, course: courseId });

        if (grade) {
            // Update existing
            grade.midtermScore = midtermScore;
            grade.examScore = examScore;
        } else {
            // Create new
            grade = new Grade({
                student: studentId,
                course: courseId,
                midtermScore,
                examScore
            });
        }

        // Calculate total and letter grade
        grade.totalScore = midtermScore + examScore;
        grade.letterGrade = calculateLetterGrade(grade.totalScore);

        await grade.save();
        res.json({ message: 'Grades saved successfully!', grade });

    } catch (error) {
        res.status(500).json({ error: 'Failed to save grades' });
    }
};

// 2. Get all grades for a specific course (Teacher/Admin)
exports.getCourseGrades = async (req, res) => {
    try {
        const { courseId } = req.params;
        
        // Find all grades for this course, and populate the student's name
        const grades = await Grade.find({ course: courseId })
            .populate('student', 'name studentId');
            
        res.json(grades);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch grades' });
    }
};

// 3. Get a student's transcript (Student)
exports.getStudentGrades = async (req, res) => {
    try {
        const { studentId } = req.params;
        
        const grades = await Grade.find({ student: studentId })
            .populate('course', 'title code credits');
            
        res.json(grades);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch transcript' });
    }
};