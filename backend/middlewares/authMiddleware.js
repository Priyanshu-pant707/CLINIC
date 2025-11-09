


const jwt = require("jsonwebtoken");
const userModel = require("../models/user");

const verifyToken = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader) return res.status(401).json({ message: "Authorization header missing" });

    const token = authHeader.split(" ")[1];
    if (!token) return res.status(401).json({ message: "Token missing" });

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const user = await userModel.findById(decoded.id).populate("clinic");
    if (!user) return res.status(404).json({ message: "User not found" });

    req.user = {
      id: user._id,
      role: user.role,
      clinicId: user.clinic?._id || null,
    };

    next();
  } catch (err) {
    res.status(401).json({ message: "Invalid or expired token" });
  }
};

module.exports = verifyToken;
