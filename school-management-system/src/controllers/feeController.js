const Fee = require('../models/Fee');
const User = require('../models/User');

// 1. Generate Fee Invoice (Admin only)
exports.generateInvoice = async (req, res) => {
    try {
        const { studentId, amount, semester } = req.body;
        
        // Check if student exists
        const student = await User.findById(studentId);
        if (!student) {
            return res.status(404).json({ error: 'Student not found' });
        }

        const newFee = new Fee({ student: studentId, amount, semester });
        await newFee.save();
        
        res.status(201).json({ message: 'Invoice generated!', fee: newFee });
     } catch (error) {
        console.error("INVOICE ERROR:", error.message);
    }
};

// 2. Student Pays Fees (Mock MoMo Payment)
exports.payFees = async (req, res) => {
    try {
        const { feeId } = req.params;
        
        const fee = await Fee.findById(feeId);
        if (!fee) return res.status(404).json({ error: 'Invoice not found' });
        if (fee.status === 'paid') return res.status(400).json({ error: 'Fees already paid' });

        // Simulate payment processing...
        fee.status = 'paid';
        await fee.save();

        res.json({ message: 'Payment successful! (Mock)', fee });
    } catch (error) {
        res.status(500).json({ error: 'Payment failed' });
    }
};

// 3. Get Student's Fee Status
exports.getStudentFees = async (req, res) => {
    try {
        const { studentId } = req.params;
        const fees = await Fee.find({ student: studentId });
        res.json(fees);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch fees' });
    }
};

// 4. Get Total Revenue (Admin Dashboard Analytics)
exports.getRevenueStats = async (req, res) => {
    try {
        // MongoDB Aggregation Pipeline
        const stats = await Fee.aggregate([
            {
                $group: {
                    _id: '$status',
                    totalAmount: { $sum: '$amount' },
                    count: { $sum: 1 }
                }
            }
        ]);

        // Format the output for the frontend charts
        let formatted = { paid: 0, unpaid: 0, paidCount: 0, unpaidCount: 0 };
        stats.forEach(stat => {
            if (stat._id === 'paid') {
                formatted.paid = stat.totalAmount;
                formatted.paidCount = stat.count;
            } else {
                formatted.unpaid = stat.totalAmount;
                formatted.unpaidCount = stat.count;
            }
        });

        res.json(formatted);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch revenue stats' });
    }
};