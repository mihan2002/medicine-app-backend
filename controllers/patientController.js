const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const Patient = require("../model/patientModel");

exports.register = async (req, res) => {
  const { firstName, lastName, dateOfBirth, gender, email, password } =
    req.body;

  try {
    const newPatient = await Patient.addPatient({
      firstName,
      lastName,
      dateOfBirth,
      gender,
      email,
      password,
    });

    if (newPatient) {
      res.status(201).json({ message: "Patient registered successfully" });
    }
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};

exports.login = async (req, res) => {
  const { email, password } = req.body;

  try {
    const patient = await Patient.findOne({ email: email });

    if (!patient) {
      return res.status(400).json({ message: "Invalid email or password" });
    }

    const isMatch = await bcrypt.compare(password, patient.password);

    if (!isMatch) {
      return res.status(400).json({ message: "Invalid email or password" });
    }

    const payload = { id: patient._id, email: patient.email };
    const token = jwt.sign(payload, "secret", { expiresIn: "1h" });

    res.status(200).json({ token, message: "Login successful" });
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};

exports.booking = async (req, res) => {
  const { email, password } = req.body;

  try {
    const patient = await Patient.findOne({ email: email });

    if (!patient) {
      return res.status(400).json({ message: "Invalid email or password" });
    }

    const isMatch = await bcrypt.compare(password, patient.password);

    if (!isMatch) {
      return res.status(400).json({ message: "Invalid email or password" });
    }

    const payload = { id: patient._id, email: patient.email };
    const token = jwt.sign(payload, "secret", { expiresIn: "1h" });

    res.status(200).json({ token, message: "Login successful" });
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};