const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json());

mongoose.connect(process.env.MONGO_URI)
    .then(() => console.log('Connected to School SMS DB!'))
    .catch(err => console.log('Database error:', err));

app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/courses', require('./routes/courseRoutes'));
app.use('/api/grades', require('./routes/gradeRoutes'));
app.use('/api/fees', require('./routes/feeRoutes'));

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`School Management API running on port ${PORT}`);
});