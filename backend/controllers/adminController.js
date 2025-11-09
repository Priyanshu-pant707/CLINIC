const clinicModel = require("../models/Clinic");
const bcrypt = require("bcrypt");
const userModel = require("../models/user")
const addDoctor = async (req, res) => {
    try {
        const { name, email, password } = req.body;
        const clinicAdminId = req.user.id;

        const clinic = await clinicModel.findOne({ clinicAdmins: clinicAdminId });
        if (!clinic) {
            return res.status(403).json({ message: "No clinic found for this admin" });

        }


        const hashedPassword = await bcrypt.hash(password, 10);
        const doctor = await userModel.create({
            name,
            email,
            password: hashedPassword,
            role: "doctor",
            clinic: clinic._id
        });


        clinic.doctors.push(doctor._id);
        await clinic.save();

        res.status(201).json({
            message: "Doctor Added successfully", doctor
        });

    } catch (err) {
        res.status(500).json({ message: err.message });
    }


}

const addPatient = async (req, res) => {
    try {
        const { name, email, password } = req.body;
        const clinicAdminId = req.user.id;

        const clinic = await clinicModel.findOne({ clinicAdmins: clinicAdminId });

        if (!clinic) {
            return res.status(403).json({ message: "no clinic found for this admin" });


        }


        const hashedPassword = await bcrypt.hash(password, 10);
        const patient = await userModel.create({
            name,
            email,
            password: hashedPassword,
            role: "patient",
            clinic: clinic._id
        });

        clinic.patients.push(patient._id);
        await clinic.save();

        res.status(201).json({ message: "Pateint added successfully", patient });
    } catch (err) {
        res.status(500).json({
            message: err.message
        });
    }
}

const showDoctor = async (req, res) => {
    try {
        const clinicId = req.user.clinicId;


        // find the clinic with the doctor details

        const clinic = await clinicModel.findById(clinicId).populate("doctors", "name email role");

        if (!clinic) {
            return res.status(404).json({
                message: "Clinic not found"
            });
        }

        return res.status(200).json({
            message: "List of all docotrs in the clinic",
            doctors: clinic.doctors,
        });

    } catch (err) {
        res.status(500).json({ message: "Error fetching doctor", error: error.message });
    }
}

const showPatient = async(req, res) => {
try{
    const clinicId=req.user.clinicId;
    const clinic=await clinicModel.findById(clinicId).populate("patients","name email role");

    if(!clinic){
        return res.status(404).json({
            message:"Clinic not found"
        });
    }

    return res.status(200).json({
        message:"List of all patients in  this clinic",
        patients:clinic.patients,
    });
}catch(error){
res.status(500).json({message:"Error fetching patients",error:error.message});
}
}






module.exports = {
    addDoctor,
    addPatient,
    showDoctor,
    showPatient
}