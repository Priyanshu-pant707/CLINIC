const express=require('express');

const verifyToken=require("../middlewares/authMiddleware")

const roleAuthenticator=require("../middlewares/roleMiddleware")
const router=express.Router();

const appointmentControllers=require("../controllers/appointmentControllers")

const prescriptionController= require("../controllers/prescriptionController")


//patient can book the appointment
router.post('/appointments/book',
    verifyToken,
    roleAuthenticator(['patient']),
    appointmentControllers.createAppointment);

// can get his/her appointments
router.get('/appointments',
    verifyToken,
    roleAuthenticator(['patient']),
    appointmentControllers.getPatientAppointments);

// can get his/her prescriptions
router.get('/prescription',
    verifyToken,
    prescriptionController.getPrescriptionByPatient);
// router.get('/dashboard/:id',
//     verifyToken,
//     patientInfo);


module.exports=router;