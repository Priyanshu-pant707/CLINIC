const prescriptionModel =require("../models/prescription");
const appointmentModel=require("../models/appointment");



// create a new prescription

// for doctor
const createPrescription =async(req,res)=>{
    try{
        const {diagnosis,medicines,notes}=req.body;
        const appointmentId=req.params.id;
        const doctorId=req.user.id;
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
        console.error("Prescription creation error:", err);
    res.status(500).json({
      success: false,
      message: "Internal server error",
      error: err.message,
    });
    }
};



// get prescription by patient (for old records)


const getPrescriptionByPatient =async(req,res)=>{
    try{
        const  patientId= req.user.id;
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