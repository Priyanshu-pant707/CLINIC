const roleAuthenticator = (...allowedRoles) => {
    return (req, res, next) => {
        if (!req.user) {
            res.status(401).json({ message: "user is not authenticated" });
        }
        if (!allowedRoles.includes(req.user.role)) {
            res.status(403).json({ message: "Access denied" });
        }

        next();
    }
}


module.exports = roleAuthenticator;