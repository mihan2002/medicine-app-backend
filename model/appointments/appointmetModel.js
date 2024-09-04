const mongoose = require("mongoose");
const Schema = mongoose.Schema;

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
    notes: { String },
    prescription:[{
      type:String,
      
    }]
  },
  {
    discriminatorKey: "status",
    timestamps: true, // Automatically add createdAt and updatedAt timestamps
  }
);

const Appointment = mongoose.model("Appointment", AppointmentSchema);

module.exports = {
  Appointment,
};
