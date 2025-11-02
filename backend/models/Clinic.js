const mongoose = require("mongoose")



const clinicSchema = new mongoose.Schema({
    name: String,
    location: String,
    description: String,
    createdBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"     // super admin-  who can add , delete and alter the clinic 
    },
    clinicAdmins: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "User" // admin of the particular clinic

    }],
    doctors: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"  // doctor belonging to the clinic
    }],
    patients: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "User" // patients 
    }]


});


const clinicModel = mongoose.model("Clinic", clinicSchema);

module.exports = clinicModel;