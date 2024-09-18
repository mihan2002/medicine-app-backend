require("dotenv").config();
const MDB = process.env.MONGO_URI;
const mongoose = require("mongoose");
const Patient = require("./model/patientModel");
const Doctor = require("./model/doctorModel");
// const UpcomingAppointmentModel = require("./model/appointments/UpcomingAppointmentModel");
// const UpcomingAppointmentModel = require("./model/appointments/CompletedAppointmentModel");

async function name() {
  try {
    const data = await Doctor.getAllDoctors();
    //const data = await Patient.getPatient();

    console.log(data);
  } catch (error) {
    console.log(error);
  }
}

name();

mongoose
  .connect(MDB, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => {
    console.log("Connected to MongoDB");
  })
  .catch((err) => {
    console.error("Failed to connect to MongoDB", err);
  });
