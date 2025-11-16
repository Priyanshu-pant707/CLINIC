const prescriptionModel = require("../models/prescription");

const appointmentModel = require("../models/appointment");



// create a new prescription

// for doctor
const createPrescription = async (req, res) => {
    try {
        const { diagnosis, medicines, advice } = req.body;
        const appointmentId = req.params.id;
        const doctorId = req.user.id;

        const appointment = await appointmentModel.findById(appointmentId);

        if (!appointment) {
            return res.status(404).json({ message: "Appointment not found" });
        }

        // doctor access check
        if (appointment.doctorId.toString() !== doctorId) {
            return res.status(403).json({
                success: false,
                message: "Not allowed to write prescription for this appointment",
            });
        }

        // Already prescription exists? same prescription do bar thodi nhi denge
        const exists = await prescriptionModel.findOne({ appointmentId });
        if (exists) {
            return res.status(400).json({
                success: false,
                message: "Prescription already exists for this appointment",
            });
        }

        // Medicines validation -  hai ki nhi 
        if (!medicines || medicines.length === 0) {
            return res.status(400).json({
                success: false,
                message: "Medicines list is required",
            });
        }

        const prescription = await prescriptionModel.create({
            appointmentId,
            doctorId,
            patientId: appointment.patientId,
            clinicId: appointment.clinicId,
            diagnosis,
            medicines,
            advice,
        });

        // link to appointment
        appointment.prescriptions.push(prescription._id);
        // yhi se hum jo h vo appointment ka status update kr denge then re render frontend se hojyega
        appointment.status = "completed";
        await appointment.save();

        return res.status(201).json({
            success: true,
            message: "Prescription added successfully",
            data: prescription,
        });

    } catch (err) {
        console.error("Prescription creation error:", err);
        return res.status(500).json({
            success: false,
            message: "Internal server error",
            error: err.message,
        });
    }
};



const getPrescriptionByDoctor = async (req, res) => {
    try {
        const doctorId = req.user.id; // jo bhi h token se lelenge
        const prescriptions = await prescriptionModel
            .find({ doctorId })
            .populate("patientId", "name email")
            .populate("appointmentId", "date time status")
            .populate("clinicId", "clinicName location");

        if (!prescriptions.length) {
            return res.status(404).json({
                success: false,
                message: "No prescriptions found for this doctor",
            });
        }

        return res.status(200).json({
            success: true,
            data: prescriptions,
        });

    } catch (err) {
        console.error("Get doctor prescriptions error:", err);
        return res.status(500).json({
            success: false,
            message: "Internal server error",
            error: err.message,
        });
    }
};



const updatePrescriptionByDoctor=async(req,res)=>{
    try{
        const prescriptionId=req.params.id;
        const doctorId=req.user.id;
        const {diagnosis,medicines,advice}=req.body;



        // find the prescription

        const prescription = await prescriptionModel.findById(prescriptionId);



        if(!prescriptionId){
            return res.status(404).json({
                success:false,
                message:"Prescription not found",
            });
        }


        // doctor access check 
        // and the main thing only the doctor who wrote it can update it

        if(prescription.doctorId.toString()!==doctorId.toString()){
            return res.status(403).json({
                success:false,
                message:"Not allowed o update this prescription"
            });
        }


        // medicines check kro ki hai ki nhi


        if(medicines && medicines.length ===0){
            return res.status(400).json({
                success:false,
                message:"Medicines list cannot be empty",
            })
        }



        // updates the fie;s only if provided

        if(diagnosis) prescription.diagnosis=diagnosis;
        if(medicines) prescription.medicines = medicines;
        if(advice) prescription.advice=advice;


        await prescription.save();


        return res.status(200).json({
            success:true,
            message :"Prescription updates successfully",
            data:prescription,
        });


    }catch(err){

        return res.status(500).json({
            success:false,
            message:"Internal server error...",
            error: err.message,
        });

    }
}



// get prescription by patient (for old records)
const getPrescriptionByPatient = async (req, res) => {
    try {
        const patientId = req.user.id;

        const prescriptions = await prescriptionModel
            .find({ patientId })
            .populate("doctorId", "name email")
            .populate("clinicId", "clinicName location")
            .populate("appointmentId", "date time status");

        if (!prescriptions.length) {
            return res.status(404).json({ message: "No prescriptions found" });
        }

        return res.status(200).json({
            success: true,
            data: prescriptions,
        });

    } catch (err) {
        return res.status(500).json({
            success: false,
            message: "Internal server error",
            error: err.message,
        });
    }
};



module.exports = {
    createPrescription,
    getPrescriptionByPatient,
    getPrescriptionByDoctor,
    updatePrescriptionByDoctor
}