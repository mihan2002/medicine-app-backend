const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const Patient = require("../model/patientModel");

// Registers a new patient
exports.register = async (req, res) => {
  const { firstName, lastName, dateOfBirth, gender, email, password } =
    req.body;

  console.log(req.body);

  try {
    // Create a new patient using the Patient model
    const patient = await Patient.addPatient({
      firstName,
      lastName,
      dateOfBirth,
      gender,
      email,
      password,
    });

    // If patient is created successfully, send response
    const accessToken = jwt.sign(
      { id: patient._id, email: patient.email },
      process.env.ACCESS_TOKEN,
      { expiresIn: "1h" }
    );

    // Generate a refresh token (valid for 7 days)
    const refreshToken = jwt.sign(
      { id: patient._id, email: patient.email },
      process.env.REFRESH_TOKEN,
      { expiresIn: "7d" }
    );

    // Save the refresh token in the database for the patient
    patient.refreshToken = refreshToken;
    await patient.save();

    // Return the tokens and a success message
    res.status(200).json({
      accessToken,
      refreshToken,
      message: "Login successful",
    });
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};

// Logs in a patient and returns access and refresh tokens
exports.login = async (req, res) => {
  const { email, password } = req.body;

  try {
    // Find the patient by email
    const patient = await Patient.findOne({ email });

    // If patient is not found, return an error
    if (!patient) {
      return res.status(400).json({ message: "Invalid email or password" });
    }

    // Compare the provided password with the stored hashed password
    const isMatch = await bcrypt.compare(password, patient.password);

    // If passwords don't match, return an error
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid email or password" });
    }

    // Generate an access token (valid for 1 hour)
    const accessToken = jwt.sign(
      { id: patient._id, email: patient.email },
      process.env.ACCESS_TOKEN,
      { expiresIn: "1h" }
    );

    // Generate a refresh token (valid for 7 days)
    const refreshToken = jwt.sign(
      { id: patient._id, email: patient.email },
      process.env.REFRESH_TOKEN,
      { expiresIn: "7d" }
    );

    // Save the refresh token in the database for the patient
    patient.refreshToken = refreshToken;
    await patient.save();

    // Return the tokens and a success message
    res.status(200).json({
      accessToken,
      refreshToken,
      message: "Login successful",
    });
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};

// Refreshes the access token using the refresh token
exports.refreshToken = async (req, res) => {
  const { refreshToken } = req.body;

  // Check if a refresh token is provided
  if (!refreshToken) {
    return res.status(400).json({ message: "Refresh token is required" });
  }

  try {
    // Verify the provided refresh token
    const decoded = jwt.verify(refreshToken, process.env.REFRESH_TOKEN);

    // Find the patient by decoded ID
    const patient = await Patient.findById(decoded.id);

    // Check if the patient exists and if the refresh token matches
    if (!patient || patient.refreshToken !== refreshToken) {
      return res.status(403).json({ message: "Invalid refresh token" });
    }

    // Generate a new access token (valid for 1 hour)
    const newAccessToken = jwt.sign(
      { id: patient._id, email: patient.email },
      process.env.ACCESS_TOKEN,
      { expiresIn: "1h" }
    );

    // Optionally generate a new refresh token (valid for 7 days)
    const newRefreshToken = jwt.sign(
      { id: patient._id, email: patient.email },
      process.env.REFRESH_TOKEN,
      { expiresIn: "7d" }
    );

    // Update the patient's refresh token in the database
    patient.refreshToken = newRefreshToken;
    await patient.save();

    // Return the new tokens
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

// Authenticates a patient for booking purposes
exports.booking = async (req, res) => {
  const { email, password } = req.body;

  try {
    // Find the patient by email
    const patient = await Patient.findOne({ email });

    // If patient is not found, return an error
    if (!patient) {
      return res.status(400).json({ message: "Invalid email or password" });
    }

    // Compare the provided password with the stored hashed password
    const isMatch = await bcrypt.compare(password, patient.password);

    // If passwords don't match, return an error
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid email or password" });
    }

    // Generate a token (valid for 1 hour) for booking purposes
    const payload = { id: patient._id, email: patient.email };
    const token = jwt.sign(payload, process.env.ACCESS_TOKEN, {
      expiresIn: "1h",
    });

    // Return the token and success message
    res.status(200).json({ token, message: "Login successful" });
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};
