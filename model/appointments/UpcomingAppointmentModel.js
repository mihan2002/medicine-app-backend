const Appointment = require("./appointmentModel"); // Import the base Appointment model
const mongoose = require("mongoose");
const Schema = mongoose.Schema;

// Define the schema for upcoming appointments
const UpcomingAppointmentSchema = new Schema({
  reminderSent: {
    type: Boolean,
    default: false,
  },
});

// Use discriminator to create UpcomingAppointment model
const UpcomingAppointment = Appointment.discriminator(
  "UpcomingAppointment",
  UpcomingAppointmentSchema
);

// Export the UpcomingAppointment model
module.exports = UpcomingAppointment;
