const User = require('../models/User');
const bcrypt = require('bcryptjs'); // THIS WAS MISSING BEFORE
const jwt = require('jsonwebtoken');

exports.register = async (req, res) => {
    try {
        const { name, email, password, role, studentId, employeeId } = req.body;
        const newUser = new User({ name, email, password, role, studentId, employeeId });
        await newUser.save();
        res.status(201).json({ message: `${role} registered successfully!` });
    } catch (error) {
        console.error("REGISTRATION ERROR:", error.message); // This will print the real error to your terminal
        res.status(500).json({ error: 'Registration failed. Email might already exist.' });
    }
};

exports.login = async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ email });
        if (!user) return res.status(404).json({ error: 'User not found' });

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) return res.status(401).json({ error: 'Invalid credentials' });

        const token = jwt.sign(
            { userId: user._id, role: user.role, name: user.name }, 
            process.env.JWT_SECRET, 
            { expiresIn: '8h' }
        );

        res.json({ 
            message: 'Login successful', 
            token,
            user: { id: user._id, name: user.name, role: user.role }
        });
    } catch (error) {
        console.error("LOGIN ERROR:", error.message);
        res.status(500).json({ error: 'Login failed' });
    }
};

exports.getProfile = async (req, res) => {
    try {
        const user = await User.findById(req.user.userId).select('-password');
        res.json(user);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch profile' });
    }
};
exports.getAllUsers = async (req, res) => {
    try {
        const users = await User.find().select('-password');
        res.json(users);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch users' });
    }
};
// Seed Dummy Data
exports.seedDummyData = async (req, res) => {
    try {
        const bcrypt = require('bcryptjs');
        const Course = require('../models/Course');
        
        // 1. Create Teachers
        const teacher1 = new User({ name: 'Dr. Mensah', email: 'mensah@sms.com', password: 'pass123', role: 'teacher', employeeId: 'EMP001' });
        const teacher2 = new User({ name: 'Prof. Owusu', email: 'owusu@sms.com', password: 'pass123', role: 'teacher', employeeId: 'EMP002' });
        const teacher3 = new User({ name: 'Dr. Agyemang', email: 'agyemang@sms.com', password: 'pass123', role: 'teacher', employeeId: 'EMP003' });
        await User.insertMany([teacher1, teacher2, teacher3]);

        // 2. Create Courses & Assign Teachers
        const course1 = new Course({ title: 'Data Structures', code: 'DCIT 201', credits: 3, teacher: teacher1._id });
        const course2 = new Course({ title: 'Operating Systems', code: 'DCIT 301', credits: 3, teacher: teacher2._id });
        const course3 = new Course({ title: 'Database Systems', code: 'DCIT 319', credits: 4, teacher: teacher3._id });
        await Course.insertMany([course1, course2, course3]);

        // 3. Create Students
        const studentNames = ['Isaac', 'Ama', 'Kofi', 'Akosua', 'Kwabena', 'Yaa', 'Fiifi', 'Esi', 'Kojo', 'Adwoa'];
        const students = [];
        
        for (let i = 0; i < studentNames.length; i++) {
            const student = new User({
                name: studentNames[i],
                email: `${studentNames[i].toLowerCase()}@sms.com`,
                password: 'pass123',
                role: 'student',
                studentId: `UCC${1000 + i}`
            });
            students.push(student);
        }
        await User.insertMany(students);

        // 4. Enroll Students in Courses randomly
        course1.students = [students[0]._id, students[1]._id, students[2]._id, students[3]._id, students[4]._id];
        course2.students = [students[5]._id, students[6]._id, students[7]._id];
        course3.students = [students[8]._id, students[9]._id, students[0]._id, students[2]._id];
        await course1.save();
        await course2.save();
        await course3.save();

        res.status(201).json({ message: 'Dummy data seeded successfully! 3 Teachers, 10 Students, 3 Courses.' });
    } catch (error) {
        res.status(500).json({ error: 'Failed to seed data. Might already exist.' });
    }
};