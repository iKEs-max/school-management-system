const Course = require('../models/Course');
const User = require('../models/User');

// 1. Create a new course (Admin only)
exports.createCourse = async (req, res) => {
    try {
        const { title, code, credits } = req.body;
        const newCourse = new Course({ title, code, credits });
        await newCourse.save();
        res.status(201).json({ message: 'Course created!', course: newCourse });
    } catch (error) {
        res.status(500).json({ error: 'Failed to create course' });
    }
};

// 2. Assign a teacher to a course (Admin only)
exports.assignTeacher = async (req, res) => {
    try {
        const { courseId, teacherId } = req.body;
        
        const course = await Course.findById(courseId);
        if (!course) return res.status(404).json({ error: 'Course not found' });

        // Update course and teacher
        course.teacher = teacherId;
        await course.save();

        res.json({ message: 'Teacher assigned successfully!', course });
    } catch (error) {
        res.status(500).json({ error: 'Failed to assign teacher' });
    }
};

// 3. Enroll a student in a course (Admin/Student)
exports.enrollStudent = async (req, res) => {
    try {
        const { courseId, studentId } = req.body;
        
        const course = await Course.findById(courseId);
        if (!course) return res.status(404).json({ error: 'Course not found' });

        // Prevent duplicate enrollment
        if (course.students.includes(studentId)) {
            return res.status(400).json({ error: 'Student already enrolled' });
        }

        course.students.push(studentId);
        await course.save();

        res.json({ message: 'Student enrolled successfully!', course });
    } catch (error) {
        res.status(500).json({ error: 'Failed to enroll student' });
    }
};

// 4. Get all courses (with populated teacher and student data)
exports.getCourses = async (req, res) => {
    try {
        // .populate() replaces the IDs with the actual object data!
        const courses = await Course.find()
            .populate('teacher', 'name email')
            .populate('students', 'name email studentId');
            
        res.json(courses);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch courses' });
    }
};