const express = require("express");
const router = express.Router();

const verifyToken= require("../middlewares/authMiddleware")
const appointmentControllers = require('../controllers/appointmentControllers');



// for user to make a appointment
router.post('/', 
    verifyToken,
    appointmentControllers.createAppointment);



// for clinic admin and the doctor to visit and update the appointments


router.get('/', 
    verifyToken,
    appointmentControllers.getAllAppointments);


// updating the appointment status for the user by the admin and doctor

router.patch('/:id',
    verifyToken,
     appointmentControllers.updateAppointmentStatus);



module.exports = router;