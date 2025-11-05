const mongoose = require("mongoose");

const clinicSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true,
    trim: true
  },
  location: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    default: "No description provided"
  },
  contactInfo: {
    phone: String,
    email: String,
    website: String
  },
  status: {
    type: String,
    enum: ["active", "inactive"],
    default: "active"
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User", // super admin
    required: true
  },
  clinicAdmins: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: "User" // clinic admins
  }],
  doctors: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: "User" // doctors of the clinic
  }],
  patients: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: "User" // patients of the clinic
  }]
}, { timestamps: true });

const clinicModel = mongoose.model("Clinic", clinicSchema);
module.exports = clinicModel;
