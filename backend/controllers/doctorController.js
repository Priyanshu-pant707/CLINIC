const Doctor = require('../models/Doctor');
const Clinic = require('../models/Clinic');

// Add doctor to clinic
exports.addDoctor = async (req, res) => {
    const clinic = await Clinic.findById(req.params.id);
    if (!clinic) return res.status(404).json({ message: 'Clinic not found' });

    const newDoctor = new Doctor({ ...req.body, clinic: clinic._id });
    await newDoctor.save();

    clinic.doctors.push(newDoctor._id);
    await clinic.save();

    res.status(201).json({ message: 'Doctor added', doctor: newDoctor });
};

// List doctors of a clinic
exports.listDoctors = async (req, res) => {
    const clinic = await Clinic.findById(req.params.id).populate('doctors');
    if (!clinic) return res.status(404).json({ message: 'Clinic not found' });
    res.json(clinic.doctors);
};
