const Appointment = require("./appointmetModel");

const CompletedAppointmentSchema = new Schema({
  outcome: {
    type: String,
    required: true,
  },
  followUpDate: Date,
});

const CompletedAppointment = Appointment.discriminator(
  "CompletedAppointment",
  CompletedAppointmentSchema
);

module.exports = {
  CompletedAppointment,
};
