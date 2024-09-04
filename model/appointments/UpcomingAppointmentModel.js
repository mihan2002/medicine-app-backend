const Appointment = require("./appointmetModel");

// Upcoming Appointment Schema
const UpcomingAppointmentSchema = new Schema({
  reminderSent: {
    type: Boolean,
    default: false,
  },
});

const UpcomingAppointment = Appointment.discriminator(
  "UpcomingAppointment",
  UpcomingAppointmentSchema
);

module.exports = {
  UpcomingAppointment,
};
