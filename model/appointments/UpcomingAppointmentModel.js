const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const db = mongoose.connection.useDb("mydatabase");

// Define the schema for upcoming appointments
const UpcomingAppointmentSchema = new Schema(
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
    reminderSent: {
      type: Boolean,
      default: true,
    },
    reason: {
      type: String,
      required: false,
    },
    notes: {
      type: String,
      required: false,
    },
    prescription: [
      {
        type: String,
      },
    ],
  },
  {
    timestamps: true, // Automatically add createdAt and updatedAt timestamps
  }
);

// Create the UpcomingAppointment model (this will use its own collection)
const UpcomingAppointment = db.model(
  "UpcomingAppointment",
  UpcomingAppointmentSchema
);

// Export the UpcomingAppointment model
module.exports = UpcomingAppointment;
