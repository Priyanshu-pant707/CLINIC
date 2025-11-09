const roleAuthenticator = (allowedRoles) => {
  return (req, res, next) => {
    try {
      if (!req.user) {
        return res.status(401).json({ message: "User is not authenticated" });
      }

      if (!allowedRoles.includes(req.user.role)) {
        return res.status(403).json({ message: "Access denied" });
      }

      //  Only call next() if everything is okay
      next();
    } catch (err) {
      console.error("Role authenticator error:", err);
      return res.status(500).json({ message: "Server error during role verification" });
    }
  };
};

module.exports = roleAuthenticator;
