const jwt = require('jsonwebtoken');

exports.verifyToken = (req, res, next) => {
    // 1. Get the header. It usually looks like: "Bearer eyJhb..."
    const authHeader = req.headers['authorization'] || req.headers['Authorization'];
    
    if (!authHeader) {
        return res.status(403).json({ error: 'No token provided' });
    }

    // 2. Split "Bearer" and the actual token, and take the token part
    const token = authHeader.startsWith('Bearer ') 
        ? authHeader.split(' ')[1] 
        : authHeader;

    if (!token) {
        return res.status(403).json({ error: 'Malformed token' });
    }

    // 3. Verify the token
    jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
        if (err) {
            console.error("JWT VERIFY ERROR:", err.message);
            return res.status(401).json({ error: 'Invalid or expired token' });
        }
        
        // 4. Save the user info for the next route
        req.user = decoded;
        next();
    });
};

// Middleware to check specific roles
exports.isAdmin = (req, res, next) => {
    if (req.user.role !== 'admin') {
        return res.status(403).json({ error: 'Admin access only' });
    }
    next();
};

// Middleware to check if Teacher or Admin
exports.isTeacherOrAdmin = (req, res, next) => {
    if (req.user.role !== 'teacher' && req.user.role !== 'admin') {
        return res.status(403).json({ error: 'Teacher or Admin access only' });
    }
    next();
};