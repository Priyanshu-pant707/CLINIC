

const express=require('express');
const router=express.Router();

const doctorController=require(".././controllers/doctorController");
const verifyToken = require("../middlewares/authMiddleware");
const roleAuthenticator=require("../middlewares/roleMiddleware");

const prescriptionController=require("../controllers/prescriptionController")


// doctor can see appointments related to the doctor
router.get('/appointment',
    verifyToken,
    roleAuthenticator(['doctor']),
    doctorController.getDoctorAppointments);

// doctor can create prescription to the particular patients based on the appointment
router.post('/prescription/:id',
    verifyToken,
    roleAuthenticator(['doctor']),
    prescriptionController.createPrescription);

// doctor can see patients related to the particular doctor
router.get('/patients',
    verifyToken,
    roleAuthenticator(['doctor']),
    doctorController.showAllPatients);


    // doctor appni de gayi prescriptions ko bhi dekh skta h
    router.get('/prescriptions',
    verifyToken,
    roleAuthenticator(['doctor']),
    prescriptionController.getPrescriptionByDoctor);


// one function will bemore which updates the appointments.


module.exports=router;