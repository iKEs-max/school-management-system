const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
    name: String,
    email: { type: String, unique: true },
    password: String,
    role: { type: String, enum: ['admin', 'teacher', 'student'], default: 'student' },
    // For students, we might want to track their index number
    studentId: { type: String, sparse: true },
    // For teachers, we might want their employee ID
    employeeId: { type: String, sparse: true }
});

// Hash password before saving
userSchema.pre('save', async function() {
    // If the password hasn't been modified, skip hashing
    if (!this.isModified('password')) return;
    
    // Hash the password
    this.password = await bcrypt.hash(this.password, 10);
});

module.exports = mongoose.model('User', userSchema);