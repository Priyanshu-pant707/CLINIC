


const userModel = require('../models/user');

const appointmentModel = require("../models/appointment");




// appointment list check krne ke liye.
const getDoctorAppointments = async (req, res) => {
    try {
        const doctorId = req.user._id; // logged in user - jwt token se mil jayega

        // optional to verify it is actually a doctor or not


        const doctor = await userModel.findById(doctorId);

        if (!doctor || doctor.role != "doctor") {
            return res.status(403).json({
                success: false,
                message: "Access Denied ! only doctors can view their appointments"
            });

        }


        const clinicId = doctor.clinic;
        const appointments = await appointmentModel.find({ doctorId, clinicId })
            .populate("patientId", "name email")
            .populate("clinicId", "name location")
            .sort({ date: -1 }) // latet date will occur first

        if (appointments.length === 0) {
            return res.status(404).json({
                success: false,
                message: "No appointments found for this doctor"
            })
        }

        res.status(200).json({
            success: true,
            messgae: "Doctor's appointments fetched successfully",
            data: appointments,
        })
    } catch (err) {
        res.status(500).json({
            success: false,
            message: "Internal server error"
        });
    }
}





// patient who are under the particular doctor.


const showAllPatients = async (req, res) => {
    try {
        const doctorId = req.user._id;
        const doctor = await userModel.findById(doctorId);


        if (!doctor || doctor.role != "doctor") {
            return res.status(403).json({
                success: false,
                message: "Access denied ! only doctor can view their patient list"

            });
        }


        const clinicId = doctor.clinic;


        // find all the appointment for that doctor in their own clinic

        const appointments = await appointmentModel.find({ doctorId, clinicId })
            .populate("patientId", "name email")
            .populate("clinicId", "name location");



        if (!appointments || appointments.length === 0) {
            return res.status(404).json({
                success: false,
                message: "No patients found for this doctor.",
            });
        }

        // extract unique patients
        const seen = new Set();
        const uniquePatients = [];

        appointments.forEach((appt) => {
            const patient = appt.patientId;
            if (patient && !seen.has(patient._id.toString())) {
                seen.add(patient._id.toString());
                uniquePatients.push(patient);
            }
        });

        res.status(200).json({
            success: true,
            message: "Unique patients fetched successfully",
            total: uniquePatients.length,
            patients: uniquePatients,
        });

    } catch (err) {
        res.status(500).json({
            success: false,
            message: "Internal server error"
        });
    }
};


module.exports = {
    getDoctorAppointments,
    showAllPatients
}