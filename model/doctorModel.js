const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const Schema = mongoose.Schema;

const db = mongoose.connection.useDb("mydatabase");

// Define the schema for doctor accounts
const DoctorSchema = new Schema(
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
      required: true,
    },
    gender: {
      type: String,
      enum: ["male", "female"],
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    specialization: {
      type: String,
      required: true,
    },
    contactNumber: {
      type: String,
      required: true,
    },
    videoVisitHours: {},
    education: {},
    recommendation: {},
    languagesSpoken: {
      type: String,
    },
  },
  {
    timestamps: true, // Automatically add createdAt and updatedAt timestamps
  }
);

DoctorSchema.pre("save", async function (next) {
  try {
    if (this.isModified("password") || this.isNew) {
      const salt = await bcrypt.genSalt(10);
      this.password = await bcrypt.hash(this.password, salt);
    }
    next();
  } catch (err) {
    next(err);
  }
});

// Add a new doctor
DoctorSchema.statics.addDoctor = async function (doctorData) {
  try {
    // Check if a doctor with the given email already exists
    const existingDoctor = await this.findOne({
      email: doctorData.email,
    });
    if (existingDoctor) {
      throw new Error("Doctor with this email already exists.");
    }

    // Create a new doctor
    const newDoctor = new this(doctorData);
    await newDoctor.save();
    return newDoctor;
  } catch (error) {
    throw error;
  }
};

// Get all doctors
DoctorSchema.statics.getAllDoctors = async function () {
  try {
    const doctors = await this.find();
    return doctors;
  } catch (error) {
    throw error;
  }
};

// Get a specific doctor by email
DoctorSchema.statics.getDoctorByEmail = async function (email) {
  try {
    const doctor = await this.findOne({ email });
    if (!doctor) {
      throw new Error("Doctor not found.");
    }
    return doctor;
  } catch (error) {
    throw error;
  }
};

const Doctor = db.model("Doctor", DoctorSchema);

module.exports = Doctor;
