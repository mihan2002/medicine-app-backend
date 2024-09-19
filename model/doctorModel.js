const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const Schema = mongoose.Schema;

const db = mongoose.connection.useDb("mydatabase");

const Review = require("./review/review"); // Import the Review model

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
    imageUrl: {
      type: String,
      required: false,
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

    // New fields added here
    about: {
      type: String,
      required: true,
    },
    qualifications: [
      {
        type: String,
        required: true,
      },
    ],
    professionalBackground: {
      type: String,
      required: true,
    },
    contactInformation: {
      phone: {
        type: String,
        required: true,
      },
      address: {
        type: String,
        required: true,
      },
      email: {
        type: String,
        required: true,
      },
    },
    rating: {
      type: Number,
      min: 0,
      max: 5,
      default: 0, // Aggregate rating based on reviews
    },
    professionStartedYear: {
      type: Number,
      required: true,
    },
    languagesSpoken: {
      type: String,
    },
    reviews: [{ type: Schema.Types.ObjectId, ref: "Review" }], // Reference to Review model
  },
  {
    timestamps: true, // Automatically add createdAt and updatedAt timestamps
  }
);

// Password hashing middleware
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
    const doctors = await this.find().populate("reviews"); // Populate reviews when fetching all doctors
    return doctors;
  } catch (error) {
    console.log(error);

    throw error;
  }
};

// Get a specific doctor by email and populate reviews
DoctorSchema.statics.getDoctorByID = async function (id) {
  try {
    const doctor = await this.findOne({ _id:id }).populate({
      path: "reviews",
      populate: {
        path: "user",
        select: "firstName lastName userImageUrl", // Populate user details in reviews
      },
    });
    if (!doctor) {
      throw new Error("Doctor not found.");
    }
    return doctor;
  } catch (error) {
    console.log(error);
    
    throw error;
  }
};

// Method to update doctor's rating based on reviews
DoctorSchema.methods.updateRating = async function () {
  try {
    const reviews = await Review.find({ doctor: this._id });
    if (reviews.length === 0) return;
    const avgRating =
      reviews.reduce((acc, review) => acc + review.rating, 0) / reviews.length;
    this.rating = avgRating;
    await this.save();
  } catch (error) {
    throw error;
  }
};

const Doctor = db.model("Doctor", DoctorSchema);

module.exports = Doctor;
