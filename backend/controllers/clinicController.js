const Clinic = require('../models/Clinic');

// List all clinics
exports.listClinics = async (req, res) => {
    const clinics = await Clinic.find();
    res.json(clinics);
};


// Get clinic by ID
exports.getClinic = async (req, res) => {
    const clinic = await Clinic.findById(req.params.id)
        .populate('doctors')
        .populate('patients');
    if (!clinic) return res.status(404).json({ message: 'Clinic not found' });
    res.json(clinic);
};

// Create clinic
exports.createClinic = async (req, res) => {
    const newClinic = new Clinic(req.body);
    await newClinic.save();
    res.status(201).json({ message: 'Clinic created', clinic: newClinic });
};

// Update clinic
exports.updateClinic = async (req, res) => {
    const updatedClinic = await Clinic.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!updatedClinic) return res.status(404).json({ message: 'Clinic not found' });
    res.json({ message: 'Clinic updated', clinic: updatedClinic });
};

// Delete clinic
exports.deleteClinic = async (req, res) => {
    const deletedClinic = await Clinic.findByIdAndDelete(req.params.id);
    if (!deletedClinic) return res.status(404).json({ message: 'Clinic not found' });
    res.json({ message: 'Clinic deleted' });
};
