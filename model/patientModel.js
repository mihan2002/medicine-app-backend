const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const Schema = mongoose.Schema;

// Define the schema for patient accounts
const db = mongoose.connection.useDb("mydatabase");

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
    // ethnicity: {
    //   type: String,
    //   required: true,
    // },
    // height: {
    //   type: Number,
    //   required: true,
    // },
    // weight: {
    //   type: Number,
    //   required: true,
    // },
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
    //preExisitingConditions: [{ type: String }],

    completedAppointments: [
      {
        type: Schema.Types.ObjectId,
        ref: "Appointment",
      },
    ],
    upcomingAppointments: [
      {
        type: Schema.Types.ObjectId,
        ref: "Appointment",
      },
    ],
  },
  {
    timestamps: true, // Automatically add createdAt and updatedAt timestamps
  }
);

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

// Add a new patient
PatientSchema.statics.addPatient = async function (patientData) {
  try {
    // Check if a patient with the given email already exists
    const existingPatient = await this.findOne({
      email: patientData.email,
    });
    if (existingPatient) {
      throw new Error("Patient with this email already exists.");
    }

    // Create a new patient
    const newPatient = new this(patientData);
    await newPatient.save();
    return newPatient;
  } catch (error) {
    throw error;
  }
};

// Get all patients
PatientSchema.statics.getAllPatients = async function () {
  try {
    const patients = await this.find();
    return patients;
  } catch (error) {
    throw error;
  }
};
PatientSchema.statics.getPatientByGoogleId = async function (googleId) {
  try {
    const patient = await this.findOne({ googleId: googleId });
    if (!patient) {
      return false;
    }
    return patient;
  } catch (error) {
    throw error;
  }
};

// Get a specific patient by email
PatientSchema.statics.getPatientByEmail = async function (email) {
  try {
    const patient = await this.findOne({ email: email });
    if (!patient) {
      throw new Error("Patient not found.");
    }
    return patient;
  } catch (error) {
    throw error;
  }
};

const Patient = db.model("Patient", PatientSchema);

module.exports = Patient;
