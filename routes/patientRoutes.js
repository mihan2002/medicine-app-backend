const express = require("express");
const router = express.Router();
const patientController = require("../controllers/patientController");
const auth = require("../authentication/patientAuth");
// Register route
router.post("/register", patientController.register);

// Login route
router.post("/login", patientController.login);

router.post("/refresh-access-token", patientController.refreshToken);

//patient booking routes
router.post("/booking", auth, patientController.booking);

module.exports = router;
