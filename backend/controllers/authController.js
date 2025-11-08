const bcrypt = require("bcrypt");
import SignUp from './../../frontend/src/pages/SignUp';

const jwt = require("jsonwebtoken");
const userModel = require("../models/user");
require("dotenv").config();

// hum  hospital management tpye bna rhe h, ab user jo h vo manually clinic admin ke thorugh add ho gya h, ab hum login rotes create kr skte h, kyu sigunp ki permission khali clinic admin and super admin ko hogi, taki koi bhi not authenticated ya faltu acocunt website ko access na kreee.



// hum ek option dedenge khali vo clinic info le skenge ki kona clinic ka facility provide kr rha h?"



const login = async (req, res) => {
    try {
        const { email, password } = req.body;

        const user = await userModel.findOne({ email });
        if (!user) {
            return res.status(404).json({
                message: "User not found",
            });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(401).json({
                message: "Invalid credentials",
            });
        }

        // payload role ke hisab se
        const payload = {
            id: user._id,
            role: user.role,
        };

        // clinicId sirf tab add karo jab user clinic se belong karta hai
        if (user.role !== "superadmin") {
            payload.clinicId = user.clinicId;
        }

        const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: "1d" });

        res.status(200).json({
            message: "Login successful",
            token,
            user: {
                name: user.name,
                email: user.email,
                role: user.role,
                clinicId: user.clinicId || null,
            },
        });
    } catch (error) {
        res.status(500).json({
            message: "Login failed",
            error: error.message,
        });
    }
};




// agr user website visit krta h.


const signUp = async () => {
    try {
        const { name, email, password, role, clinic } = req.body;


        const isUserFind = await userModel.findOne({ email });


        if (isUserFind) {
            return res.status(404).json({
                message: "Email is already registered"
            })
        }


        //create new user without any role


        const hashedPassword = await bcrypt.hash(password, 10);


        const newUser = await userModel.create({
            name,
            email,
            password: hashedPassword,
            role: "patient",
            clinic: null
        })

        res.status(201).json({
            message: "user registered successfully", newUser
        });
    } catch (err) {
        res.status(500).json({
            message: err.message
        })
    }

}

module.exports = { login,signUp };