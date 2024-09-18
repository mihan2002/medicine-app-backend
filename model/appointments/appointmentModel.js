const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const db = mongoose.connection.useDb("mydatabase");
// Base Appointment Schema
const AppointmentSchema = new Schema(
  {
    docId: {
      type: Schema.Types.ObjectId,
      ref: "Doctor",
      required: true,
    },
    patientId: {
      type: Schema.Types.ObjectId,
      ref: "Patient",
      required: true,
    },
    date: {
      type: Date,
      required: true,
    },
    reason: {
      type: String,
      required: true,
    },
    notes: {
      type: String,
    },
    prescription: [
      {
        type: String,
      },
    ],
  },
  {
    discriminatorKey: "appointmentType", // The key used to differentiate appointment types
    timestamps: true, // Automatically add createdAt and updatedAt timestamps
  }
);

// Create the base Appointment model
const Appointment = db.model("Appointment", AppointmentSchema);

// Export the base model
module.exports = Appointment;
