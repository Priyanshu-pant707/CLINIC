

const express=require('express');
const router=express.Router();

const doctorController=require(".././controllers/doctorController");

router.get('/appointment',doctorController.getAllAppointments);
router.post('/prescription/:patientId',doctorController.setPrescription);
router.get('/:doctorID/patients',doctorController.showAllPatients);



// one function will bemore which updates the appointments.
