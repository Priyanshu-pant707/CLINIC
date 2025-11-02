const express = require("express")

const router = express.Router();


//importing the function module

const superAdminController = require("../controllers/superAdminController")



//routes
router.get('/clinics',superAdminController.overview)

router.post('/clinics', superAdminController.createClinic);

router.delete('/clinics/:id',superAdminController.deleteClinic);


router.post('/clinic/:id/admin', superAdminController.addAdmin);




module.exports = router;