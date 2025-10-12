const mongoose = require('mongoose');

const patientSchema = new mongoose.Schema({
    name: { type: String, required: true },
    age: Number,
    gender: String,
    clinic: { type: mongoose.Schema.Types.ObjectId, ref: 'Clinic' },
    reports: [String]  // URLs of uploaded reports
}, { timestamps: true });

module.exports = mongoose.model('Patient', patientSchema);
