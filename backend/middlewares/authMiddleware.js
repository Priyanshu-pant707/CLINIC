const jwt = require("jsonwebtoken");

require("dotenv").config();
//creating the middleware
const verifyToken = async (req, res, next) => {

    const authHeader = req.header['authorization'];

    const token = authHeader && authHeader.split(' ')[1];


    if (!token) {
        res.status(401).json({ message: "can access this route, no permission granted" });
    }

    await jwt(token, process.env.JWT_SECRET, (err, user) => {

        if (err) {
            return res.status(403).json({ message: 'Invalid token' });
        }

        req.user = user;
        next();

    });


}



module.exports = verifyToken;