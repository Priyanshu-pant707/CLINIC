const prescriptionModel =require("../models/prescription");
const appointmentModel=require("../models/appointment");



// create a new prescription

// for doctor
const createPrescription =async(req,res)=>{
    try{
        const {appointmentId,diagnosis,medicines,notes}=req.body;
        const doctorId=req.user._id;
        const appointment= await appointmentModel.findById(appointmentId);

        if(!appointment){
            return res.status(404).json({
                message:"Appointment not found"
            })
        }


        const prescription=await prescriptionModel.create({
            appointmentId,
            doctorId,
            patientId:appointment.patientId,
            clinicId:appointment.clinicId   ,
            diagnosis,
            medicines,
            notes
        });

        // linking it to the appointment

        appointment.prescriptions.push(prescription._id);
        await appointment.save();


        res.status(201).json({
            success:true,
            message:"Prescription added successfully",
            data:prescription
        });
    }catch(err){
        res.status(500).json({
            success:false,
            message:"Internal server error"
        })
    }
};



// get prescription by patient (for old records)


const getPrescriptionByPatient =async(req,res)=>{
    try{
        const  patientId= req.user._id;
        const prescriptions=await prescriptionModel.find({patientId})
        .populate("doctorId","name email")
        . populate("clinicId","name location")
        .populate("appointmentId","date time");

        if(prescriptions.length==0){
            return res.status(404).json({message:"No prescription found"})
        }

    res.status(200).json({
        success:true,
        data:prescriptions
    });
    }catch(err){

    }
}



module.exports = {
    createPrescription,
    getPrescriptionByPatient
}