const Patient = require('../models/Patient');
const Clinic = require('../models/Clinic');

// Add patient to clinic
exports.addPatient = async (req, res) => {
    const clinic = await Clinic.findById(req.params.id);
    if (!clinic) return res.status(404).json({ message: 'Clinic not found' });

    const newPatient = new Patient({ ...req.body, clinic: clinic._id });
    await newPatient.save();

    clinic.patients.push(newPatient._id);
    await clinic.save();

    res.status(201).json({ message: 'Patient added', patient: newPatient });
};

// List patients of a clinic
exports.listPatients = async (req, res) => {
    const clinic = await Clinic.findById(req.params.id).populate('patients');
    if (!clinic) return res.status(404).json({ message: 'Clinic not found' });
    res.json(clinic.patients);
};
