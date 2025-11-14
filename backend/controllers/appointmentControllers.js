const clinicModel = require("../models/Clinic");
const userModel = require("../models/user");
const appointmentModel = require("../models/appointment");

// Create Appointment
const createAppointment = async (req, res) => {
  try {
    const {doctorName,date, time, notes } = req.body;

    const findDoctor=await userModel.findOne({name:doctorName});
    if(!findDoctor){
      return res.status(403).json({
        success:false,
        message:"Can't find the user"

      })
    }
    const doctorId=findDoctor._id;
    const patientId = req.user.id; //  use _id (not _Id)

    // Check doctor existence
    const doctor = await userModel.findById(doctorId);
    if (!doctor || doctor.role !== "doctor") {
      return res.status(404).json({ message: "Doctor not found" });
    }

    // Get clinic ID from doctor
    const clinicId = doctor.clinic;
    if (!clinicId) {
      return res.status(404).json({ message: "Clinic not found" });
    }

    // Check if slot already booked
    const existing = await appointmentModel.findOne({ doctorId, date, time });
    if (existing) {
      return res.status(409).json({
        message: "Sorry! This slot is already booked.",
      });
    }

    // Create new appointment
    const newAppointment = await appointmentModel.create({
      clinicId,
      doctorId,
      patientId,
      date,
      time,
      status: "pending",
      notes,
    });

    res.status(201).json({
      success: true,
      message: "Appointment booked successfully",
      appointment: newAppointment,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }



};



const getAllAppointments = async (req, res) => {
  try {
    const clinicId = req.user.clinicId; // Clinic Admin ke token se aa raha h

    const allAppointments = await appointmentModel
      .find({  clinicId }) // FIND appointments by clinicId
      .populate("doctorId", "name email specialization")
      .populate("patientId", "name email age")
      .populate("clinicId", "clinicName location");

    if (!allAppointments || allAppointments.length === 0) {
      return res.status(404).json({
        success: false,
        message: "No appointments found!",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Appointments retrieved successfully",
      data: allAppointments,
    });

  } catch (err) {
    console.error(err);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};


//  Update Appointment Status (e.g., approve, reject, complete)
const updateAppointmentStatus = async (req, res) => {
  try {
  
    const appointmentId=req.params.id; // ye dynamic routes se lelenge.
    const {status}=req.body;

    const updated =await appointmentModel.findByIdAndUpdate(
        appointmentId,
        {status},
        {new:true}
    );

    if(!updated){
        return res.status(404).json({
            success:false,
            message:"Appointment not found",
        });
    }

res.status(200).json({
    success:true,
    message: "Appointment status updated successfully",
    data:updated,
})

  } catch (err) {
    console.error(err);
    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};



// for patient


const getPatientAppointments=async(req,res)=>{
    try{
        const patientId = req.user._id;
        const appointments=await appointmentModel.find({patientId})
        .populate("doctorId","name specialization")
        . populate("clinicId","clinicName address")
        .sort({date:-1});


        if(!appointments.length){
            return res.status(404).json({
                success:false,
                message:"No appointments found"
            });
        }


        res.status(200).json({
            success:true,
            message:"Appointments fetched successfully",
            count: appointments.length,
            data:appointments,
        })
    }catch(err){
        res.status(500).json({message:"internal server error"});
    }
}




//  Export
module.exports = {
  createAppointment,
  getAllAppointments,
  updateAppointmentStatus,
  getPatientAppointments
};
