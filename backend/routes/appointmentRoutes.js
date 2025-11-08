const express = require("express");
const router = express.Router();


const appointmentControllers = require('../controllers/appointmentControllers');



// for user to make a appointment
router.post('/', appointmentControllers.createAppointment);



// for clinic admin and the doctor to visit and update the appointments


router.get('/', appointmentController.getAllAppointments);


// updating the appointment status for the user by the admin and doctor

router.patch('/:id', appointmentControllers.updateAppointmentStatus);



module.exports = router;