const express = require('express');
const router = express.Router();
const patientController = require('../controllers/patientController');

router.post('/:id/patient', patientController.addPatient);
router.get('/:id/patients', patientController.listPatients);

module.exports = router;
