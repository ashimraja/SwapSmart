import jwt from 'jsonwebtoken';

const adminAuth = async (req, res, next) => {
    try {
        // 1. Get token from headers (support both 'token' and Authorization header)
        const token = req.headers.token || req.headers.authorization?.split(' ')[1];
        
        if (!token) {
            return res.status(401).json({ success: false, message: "No token provided" });
        }

        // 2. Verify token
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        // 3. Check if decoded token matches admin credentials
        const adminIdentifier = process.env.ADMIN_EMAIL + process.env.ADMIN_PASSWORD;
        
        if (decoded.adminIdentifier !== adminIdentifier) {
            return res.status(403).json({ 
                success: false, 
                message: "Admin access denied" 
            });
        }

        // 4. Grant access
        req.admin = decoded;
        next();
        
    } catch (error) {
        console.error('Admin auth error:', error);
        return res.status(401).json({ 
            success: false, 
            message: error.name === 'TokenExpiredError' 
                   ? "Token expired" 
                   : "Invalid token" 
        });
    }
};

export default adminAuth;