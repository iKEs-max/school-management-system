const mongoose = require('mongoose');

const courseSchema = new mongoose.Schema({
    title: String,
    code: String, // e.g., DCIT 201
    credits: Number,
    teacher: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    students: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }]
});

module.exports = mongoose.model('Course', courseSchema);