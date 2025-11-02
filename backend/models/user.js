const mongoose = require("mongoose");


const userSchema = new mongoose.Schema({
    name: String,
    email: {
        type: String,
        unique: true,
        required: true
    },
    password: {
        type: String,
        unique: true,
        required: true
    },
    role: {
        type: String,
        enum: ["superadmin", "clinicadmin", "doctor", "patient"],
        required: true
    },
    clinic: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Clinic"
    }
});


const userModel = mongoose.model("User", userSchema)

module.exports = userModel;