require("dotenv").config();
const MDB = process.env.MONGO_URI;
const mongoose = require("mongoose");
const Patient = require("./model/patientModel");
const Doctor = require("./model/doctorModel");

async function get() {
  try {
    const data = await Patient.find().populate({
      path: "upcomingAppointments",
      populate: {
        path: "docId", // Path to doctor reference in Appointment
        // Replace with fields you want from Doctor schema
      },
    });

    console.log(data[0].upcomingAppointments[0].docId);
  } catch (error) {
    console.log(error);
  }
}

get();
mongoose
  .connect(MDB, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => {
    console.log("Connected to MongoDB");
  })
  .catch((err) => {
    console.error("Failed to connect to MongoDB", err);
  });
