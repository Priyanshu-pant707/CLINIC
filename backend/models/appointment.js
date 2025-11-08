const mongoose = require('mongoose');

const appointmentSchema = new mongoose.Schema({
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
    date: {
        type: Date,
        required: true
    },
    time: {
        type: String, // could also be a Date if you want full timestamp
        required: true
    },
    status: {
        type: String,
        enum: ['pending', 'approved', 'completed', 'cancelled'],
        default: 'pending'
    },
    notes: {
        type: String,
        default: ''
    },
   prescriptions:[{
    type:mongoose.Schema.Types.ObjectId,
    ref:"Prescription"
   }]
},{timestamps:true});

const appointmentModel = mongoose.model('Appointment', appointmentSchema);
module.exports = appointmentModel;
