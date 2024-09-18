const Appointment = require("./appointmentModel"); // Import the base Appointment model
const mongoose = require("mongoose");
const Schema = mongoose.Schema;

// Define the schema for completed appointments
const CompletedAppointmentSchema = new Schema({
  outcome: {
    type: String,
    required: true,
  },
  followUpDate: {
    type: Date,
  },
});

// Use discriminator to create CompletedAppointment model
const CompletedAppointment = Appointment.discriminator(
  "CompletedAppointment",
  CompletedAppointmentSchema
);

// Export the CompletedAppointment model
module.exports = CompletedAppointment;
