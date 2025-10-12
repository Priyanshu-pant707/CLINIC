const express = require('express');
const router = express.Router();
const clinicController = require('../controllers/clinicController');

router.get('/', clinicController.listClinics);
router.get('/:id', clinicController.getClinic);
router.post('/', clinicController.createClinic);
router.put('/:id', clinicController.updateClinic);
router.delete('/:id', clinicController.deleteClinic);

module.exports = router;
