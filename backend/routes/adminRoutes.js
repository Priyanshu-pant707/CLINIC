const express=require('express')

const router=express.Router();
const adminController=require("../controllers/adminController");

router.post('/:clinicId/doctors',adminController.addDoctor);
router.post('/:clinicId/patients',adminController.addPatient);

router.get('/:clinicId/doctors',adminController.showDoctor);
router.get('/:clinicId/patients',adminController.showPatient);


module.exports=router;