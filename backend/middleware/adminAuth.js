import jwt from 'jsonwebtoken';

const adminAuth = async (req, res, next) => {
    try {
        // Get token from headers (using Authorization header is more standard)
        const authHeader = req.headers.authorization;
        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            return res.status(401).json({ success: false, message: "Unauthorized - No token provided" });
        }

        const token = authHeader.split(' ')[1];
        
        // Verify token
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        
        // Check if the decoded token matches admin credentials
        // Note: Storing admin credentials in JWT payload is not recommended
        // Better to store admin ID/email and verify against database
        if (decoded.email !== process.env.ADMIN_EMAIL || decoded.password !== process.env.ADMIN_PASSWORD) {
            return res.status(403).json({ success: false, message: "Unauthorized - Invalid admin credentials" });
        }

        // Attach admin info to request object
        req.admin = {
            email: decoded.email,
            // Add other admin properties if needed
        };

        next();
    } catch (error) {
        console.error('Admin auth error:', error);
        
        // More specific error messages
        let message = "Authentication failed";
        if (error.name === 'JsonWebTokenError') {
            message = "Invalid token";
        } else if (error.name === 'TokenExpiredError') {
            message = "Token expired";
        }

        res.status(401).json({ 
            success: false, 
            message: message,
            error: error.message 
        });
    }
};

export default adminAuth;