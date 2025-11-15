const express = require("express");
const router = express.Router();

const verifyToken= require("../middlewares/authMiddleware")
const appointmentControllers = require('../controllers/appointmentControllers');
const roleAuthenticator = require("../middlewares/roleMiddleware");



// for user to make a appointment
router.post('/', 
    verifyToken,
    appointmentControllers.createAppointment);



// for clinic admin and the doctor to visit and update the appointments


router.get('/', 
    verifyToken,
    roleAuthenticator(['clinicadmin']),
    appointmentControllers.getAllAppointments);


// updating the appointment status for the user by the admin and doctor

router.patch('/:id',
    verifyToken,
    roleAuthenticator(["doctor","clinicadmin"]),
     appointmentControllers.updateAppointmentStatus);



module.exports = router;