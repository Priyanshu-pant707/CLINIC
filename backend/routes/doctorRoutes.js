

const express=require('express');
const router=express.Router();

const doctorController=require(".././controllers/doctorController");


const prescriptionController=require("../controllers/prescriptionController")
router.get('/appointment',doctorController.getDoctorAppointments);
router.post('/prescription/',prescriptionController.createPrescription);
router.get('/patients',doctorController.showAllPatients);



// one function will bemore which updates the appointments.
