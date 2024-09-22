require("dotenv").config();
const MDB = process.env.MONGO_URI;
const mongoose = require("mongoose");
const Patient = require("./model/patientModel");
const Doctor = require("./model/doctorModel");


async function get() {
  try {
    const data = await Patient.findOne({
      _id: "66bdc69cba7657fd4d749f94",
    }).populate("upcomingAppointments");

    console.log(data);
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
