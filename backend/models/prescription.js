const mongoose = require('mongoose');

const prescriptionSchema = new mongoose.Schema({
  appointmentId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Appointment',
    required: true
  },
  clinicId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Clinic',
    required: true
  },
  doctorId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  patientId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },

  // 💊 Prescription details
  diagnosis: {
    type: String,
    required: true
  },
  medicines: [
    {
      name: { type: String, required: true },
      dosage: { type: String },
      frequency: { type: String },
      duration: { type: String }
    }
  ],
  advice: {
    type: String,
    default: ''
  },
  issuedAt: {
    type: Date,
    default: Date.now
  }
}, { timestamps: true });

const prescriptionModel = mongoose.model('Prescription', prescriptionSchema);
module.exports = prescriptionModel;
