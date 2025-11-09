const express=require('express');


const router=express.router();

const appointmentControllers=require("../controllers/appointmentControllers")

const prescriptionController= require("../controllers/prescriptionController")

router.post('/appointments/book',appointmentControllers.createAppointment);
router.get('/appointments',appointmentControllers.getPatientAppointments);
router.get('/prescription/',prescriptionController.getPrescriptionByPatient);
router.get('/dashboard/:id',patientInfo);


module.exports=router;