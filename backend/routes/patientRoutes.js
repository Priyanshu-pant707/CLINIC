const express=require('express');


const router=express.router();



router.post('/appointments/book',bookAppointment);
router.get('/appointments/:id',showAllAppointments);
router.get('/prescription/:id',showAllPrescriptions);
router.get('/dashboard/:id',patientInfo);


module.exports=router;