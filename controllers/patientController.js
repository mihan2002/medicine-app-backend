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
    // Find the patient by email
    const patient = await Patient.findOne({ email: email });

    // If patient is not found
    if (!patient) {
      return res.status(400).json({ message: "Invalid email or password" });
    }

    // Compare passwords
    const isMatch = await bcrypt.compare(password, patient.password);

    // If password doesn't match
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid email or password" });
    }

    // Generate access token (expires in 1 hour)
    const accessToken = jwt.sign(
      { id: patient._id, email: patient.email },
      "access_secret", // Replace with a stronger secret and store in environment variables
      { expiresIn: "1h" }
    );

    // Generate refresh token (expires in 7 days, for example)
    const refreshToken = jwt.sign(
      { id: patient._id, email: patient.email },
      "refresh_secret", // Replace with a stronger secret and store in environment variables
      { expiresIn: "7d" }
    );

    // Store the refresh token in the database (optional, for revocation purposes)
    patient.refreshToken = refreshToken;
    await patient.save();

    // Send both tokens
    res.status(200).json({
      accessToken,
      refreshToken,
      message: "Login successful",
    });
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};
exports.refreshToken = async (req, res) => {
  const { refreshToken } = req.body;

  // Check if refreshToken is provided
  if (!refreshToken) {
    return res.status(400).json({ message: "Refresh token is required" });
  }

  try {
    // Verify the refresh token
    const decoded = jwt.verify(refreshToken, "refresh_secret"); // Use the same secret used in login for refresh tokens

    // Find the patient using the ID from the decoded token
    const patient = await Patient.findById(decoded.id);

    // If no patient found or refresh token doesn't match the one stored in DB (optional if you store refresh tokens)
    if (!patient || patient.refreshToken !== refreshToken) {
      return res.status(403).json({ message: "Invalid refresh token" });
    }

    // Generate a new access token
    const newAccessToken = jwt.sign(
      { id: patient._id, email: patient.email },
      "access_secret", // Use your access token secret
      { expiresIn: "1h" }
    );

    // Optionally, generate a new refresh token and update it in the DB
    const newRefreshToken = jwt.sign(
      { id: patient._id, email: patient.email },
      "refresh_secret", // Use your refresh token secret
      { expiresIn: "7d" }
    );

    // Update the refresh token in the database
    patient.refreshToken = newRefreshToken;
    await patient.save();

    // Send the new tokens to the client
    res.status(200).json({
      accessToken: newAccessToken,
      refreshToken: newRefreshToken,
      message: "Tokens refreshed successfully",
    });
  } catch (error) {
    return res
      .status(403)
      .json({ message: "Invalid or expired refresh token", error });
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
