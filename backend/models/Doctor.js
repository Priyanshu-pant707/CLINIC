const mongoose = require('mongoose');

const doctorSchema = new mongoose.Schema({
    name: { type: String, required: true },
    specialization: String,
    clinic: { type: mongoose.Schema.Types.ObjectId, ref: 'Clinic' }
}, { timestamps: true });

module.exports = mongoose.model('Doctor', doctorSchema);
