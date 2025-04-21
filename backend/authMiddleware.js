const jwt = require("jsonwebtoken");

// ✅ Middleware to authenticate JWT Token
function authenticateToken(req, res, next) {
    const authHeader = req.header("Authorization");

    if (!authHeader) {
        return res.status(401).json({ error: "⚠️ Unauthorized! No token provided." });
    }

    // Extract token safely
    const token = authHeader.startsWith("Bearer ") ? authHeader.split(" ")[1] : authHeader;

    try {
        const verified = jwt.verify(token, process.env.JWT_SECRET);
        req.user = verified;
        next();
    } catch (err) {
        if (err.name === "TokenExpiredError") {
            return res.status(401).json({ error: "⚠️ Session expired! Please log in again." });
        }
        res.status(400).json({ error: "❌ Invalid token! Please provide a valid token." });
    }
}

// ✅ Middleware to authorize Admin role
function authorizeRole(requiredRole) {
    return (req, res, next) => {
        if (!req.user || req.user.role !== requiredRole) {
            return res.status(403).json({ error: "🚫 Access denied! Admins only." });
        }
        next();
    };
}

module.exports = { authenticateToken, authorizeRole };
