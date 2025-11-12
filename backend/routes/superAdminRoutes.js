const express = require("express");
const router = express.Router();

// middlewares
const verifyToken = require("../middlewares/authMiddleware");
const roleAuthenticator = require("../middlewares/roleMiddleware");

// controller
const superAdminController = require("../controllers/superAdminController");

//  Get all clinics (Only superadmin)
router.get(
  "/clinics",
  verifyToken,
  roleAuthenticator(["superadmin"]),
  superAdminController.getAllClinics
);

//  Delete a clinic by ID (Only superadmin)
router.delete(
  "/clinics/:id",
  verifyToken,
  roleAuthenticator(["superadmin"]),
  superAdminController.deleteClinic
);

//  Create new clinic + assign clinic admin (Only superadmin)
router.post(
  "/clinic",
  verifyToken,
  roleAuthenticator(["superadmin"]),
  superAdminController.addClinicWithAdmin
);





// find clinic by the id
router.get(
  "/clinics/:id",
  verifyToken,
  roleAuthenticator(["superadmin"]),
  superAdminController.findClinicById
);


module.exports = router;
