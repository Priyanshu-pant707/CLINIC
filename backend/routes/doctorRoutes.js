const express = require('express');
const router = express.Router();
const doctorController = require('../controllers/doctorController');

router.post('/:id/doctor', doctorController.addDoctor);
router.get('/:id/doctors', doctorController.listDoctors);

module.exports = router;
