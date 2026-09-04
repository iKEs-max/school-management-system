const mongoose = require('mongoose');

const feeSchema = new mongoose.Schema({
    student: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    amount: Number,
    status: { type: String, enum: ['unpaid', 'paid'], default: 'unpaid' },
    semester: String
});

module.exports = mongoose.model('Fee', feeSchema);