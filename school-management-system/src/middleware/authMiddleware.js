const jwt = require('jsonwebtoken');

exports.verifyToken = (req, res, next) => {
    const token = req.headers['authorization'];
    if (!token) return res.status(403).json({ error: 'No token provided' });

    jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
        if (err) return res.status(401).json({ error: 'Invalid token' });
        req.user = decoded; // Attach user info to request
        next();
    });
};

// Middleware to check specific roles
exports.isAdmin = (req, res, next) => {
    if (req.user.role !== 'admin') return res.status(403).json({ error: 'Admin access only' });
    next();
};

exports.isTeacherOrAdmin = (req, res, next) => {
    if (req.user.role !== 'teacher' && req.user.role !== 'admin') 
        return res.status(403).json({ error: 'Teacher or Admin access only' });
    next();
};