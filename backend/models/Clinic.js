const mongoose = require('mongoose');

const clinicSchema = new mongoose.Schema({
    name: { type: String, required: true },
    location: String,
    description: String,
    doctors: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Doctor' }],
    patients: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Patient' }]
}, { timestamps: true });

module.exports = mongoose.model('Clinic', clinicSchema);
