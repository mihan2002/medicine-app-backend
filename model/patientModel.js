// Define the schema for patient accounts
const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const Schema = mongoose.Schema;
const db = mongoose.connection.useDb("mydatabase");

const UpcomingAppointment = require("./appointments/UpcomingAppointmentModel");

const PatientSchema = new Schema(
  {
    firstName: {
      type: String,
      required: true,
    },
    lastName: {
      type: String,
      required: true,
    },
    dateOfBirth: {
      type: Date,
      required: false,
    },
    gender: {
      type: String,
      enum: ["male", "female"],
      required: false,
    },
    languagesSpoken: {
      type: String,
      required: false,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    googleId: {
      type: String,
      required: false,
      unique: true,
    },
    password: {
      type: String,
      required: false,
    },
    refreshToken: {
      type: String,
      required: false,
    },
    existingConditions: { type: String, required: false },
    completedAppointments: [
      {
        type: Schema.Types.ObjectId,
        ref: "CompletedAppointment",
        unique: false,
      },
    ],
    upcomingAppointments: [
      {
        type: Schema.Types.ObjectId,
        ref: "UpcomingAppointment",
        unique: false,
      },
    ],
  },
  {
    timestamps: true, // Automatically add createdAt and updatedAt timestamps
  }
);

// Password hashing before save
PatientSchema.pre("save", async function (next) {
  if (this.password) {
    try {
      if (this.isModified("password") || this.isNew) {
        const salt = await bcrypt.genSalt(10);
        this.password = await bcrypt.hash(this.password, salt);
      }
      next();
    } catch (err) {
      next(err);
    }
  } else {
    next();
  }
});

PatientSchema.statics.addPatient = async function (patientData) {
  try {
    // Check if a patient already exists with the same email or Google ID

    const existingPatient = await this.findOne({ email: patientData.email });

    if (existingPatient) {
      throw new Error("Patient with this email.");
    }

    // Create and save the new patient
    const newPatient = new this(patientData);
    await newPatient.save();

    return newPatient;
  } catch (error) {
    throw new Error(error.message);
  }
};

// Flexible method to get patient data by ID, Google ID, or email
PatientSchema.statics.getPatient = async function (identifier) {
  try {
    // Check if identifier is an ObjectId, GoogleId, or email
    const query = {};

    if (mongoose.Types.ObjectId.isValid(identifier)) {
      // If it's a valid ObjectId, search by _id (patient ID)
      query._id = identifier;
    } else if (identifier.includes("@")) {
      // If it contains '@', treat it as an email
      query.email = identifier;
    } else {
      // Otherwise, treat it as a Google ID
      query.googleId = identifier;
    }
    let patient;
    try {
      // Find the patient based on the constructed query
      patient = await this.findOne(query)
        .populate({
          path: "completedAppointments",
          select: "appointmentDate doctorName status doctorId", // Populate appointment fields
          populate: {
            path: "docId", // Path to doctor reference in Appointment
            select: "firstName lastName specialization email", // Replace with fields you want from Doctor schema
          },
        })
        .populate({
          path: "upcomingAppointments",
          select: "appointmentDate doctorName status doctorId", // Populate appointment fields
          populate: {
            path: "docId", // Path to doctor reference in Appointment
            select: "firstName lastName specialization email", // Replace with fields you want from Doctor schema
          },
        });
    } catch (err) {
      patient = await this.findOne(query);
    }

    if (!patient) {
      throw new Error("Patient not found.");
    }

    // Handle missing appointments gracefully
    patient.completedAppointments = patient.completedAppointments || [];
    patient.upcomingAppointments = patient.upcomingAppointments || [];

    return patient;
  } catch (error) {
    if (error.name === "MongoError") {
      throw new Error("Database error: Unable to retrieve patient data.");
    }
    throw error;
  }
};
PatientSchema.statics.getPatients = async function () {
  try {
    let // Find the patient based on the constructed query
      patient = await this.find()
        .populate({
          path: "completedAppointments",
          populate: {
            path: "docId", // Path to doctor reference in Appointment
          },
        })
        .populate({
          path: "upcomingAppointments",
          populate: {
            path: "docId", // Path to doctor reference in Appointment

          },
        });

    if (!patient) {
      throw new Error("Patient not found.");
    }

    return patient;
  } catch (error) {
    if (error.name === "MongoError") {
      throw new Error("Database error: Unable to retrieve patient data.");
    }
    throw error;
  }
};

// Method to add completed appointment
PatientSchema.statics.addCompletedAppointment = async function (
  patientId,
  upcomingAppointmentId,
  completedAppointmentId
) {
  try {
    // Find the patient by ID
    const patient = await this.findById(patientId);

    if (!patient) {
      throw new Error("Patient not found.");
    }

    // Remove the upcoming appointment from the patient's upcomingAppointments array
    const updatedUpcomingAppointments = patient.upcomingAppointments.filter(
      (appointment) => !appointment.equals(upcomingAppointmentId)
    );
    patient.upcomingAppointments = updatedUpcomingAppointments;

    // Remove the upcoming appointment document from the UpcomingAppointment collection
    await UpcomingAppointment.findByIdAndDelete(upcomingAppointmentId);

    // Add the completed appointment to the completedAppointments array
    patient.completedAppointments.push(completedAppointmentId);

    // Save the updated patient document
    await patient.save();

    return patient;
  } catch (error) {
    throw new Error(error.message);
  }
};

// Method to add upcoming appointment
PatientSchema.statics.addUpcomingAppointment = async function (
  patientId,
  appointmentId
) {
  try {
    // Find the patient by ID
    const patient = await this.findById(patientId);

    if (!patient) {
      throw new Error("Patient not found.");
    }

    // Add the appointment to the upcomingAppointments array
    patient.upcomingAppointments.push(appointmentId);

    // Save the updated patient document
    await patient.save();

    return patient;
  } catch (error) {
    throw new Error(error.message);
  }
};

const Patient = mongoose.model("Patient", PatientSchema);

module.exports = Patient;
