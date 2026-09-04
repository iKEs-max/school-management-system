const mongoose = require('mongoose');

const gradeSchema = new mongoose.Schema({
    student: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    course: { type: mongoose.Schema.Types.ObjectId, ref: 'Course', required: true },
    midtermScore: { type: Number, default: 0 },
    examScore: { type: Number, default: 0 },
    totalScore: { type: Number, default: 0 },
    letterGrade: { type: String, default: 'N/A' }
});

module.exports = mongoose.model('Grade', gradeSchema);