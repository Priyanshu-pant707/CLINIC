const express = require("express");
const router = express.Router();

// controller
const adminController = require("../controllers/adminController");

// middlewares
const verifyToken = require("../middlewares/authMiddleware");
const roleAuthenticator = require("../middlewares/roleMiddleware");

//  Add Doctor (Only clinic admin)
router.post(
  "/doctors",
  verifyToken,
  roleAuthenticator(["clinicadmin"]),
  adminController.addDoctor
);

//  Add Patient (Only clinic admin)
router.post(
  "/patients",
  verifyToken,
  roleAuthenticator(["clinicadmin"]),
  adminController.addPatient
);

//  Show all Doctors in this clinic (Only clinic admin)
router.get(
  "/doctors",
  verifyToken,
  roleAuthenticator(["clinicadmin","patient"]),
  adminController.showDoctor
);

//  Show all Patients in this clinic (Only clinic admin)
router.get(
  "/patients",
  verifyToken,
  roleAuthenticator(["clinicadmin"]),
  adminController.showPatient
);

module.exports = router;
