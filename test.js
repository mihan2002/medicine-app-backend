// require("dotenv").config();
// const MDB = process.env.MONGO_URI;
// const mongoose = require("mongoose");
// const Patient = require("./model/patientModel");
// const Doctor = require("./model/doctorModel");
// // const UpcomingAppointmentModel = require("./model/appointments/UpcomingAppointmentModel");
// // const UpcomingAppointmentModel = require("./model/appointments/CompletedAppointmentModel");

// async function name() {
//   try {
//     const data = await Doctor.getAllDoctors();
//     //const data = await Patient.getPatient();

//     console.log(data);
//   } catch (error) {
//     console.log(error);
//   }
// }

// name();

// mongoose
//   .connect(MDB, { useNewUrlParser: true, useUnifiedTopology: true })
//   .then(() => {
//     console.log("Connected to MongoDB");
//   })
//   .catch((err) => {
//     console.error("Failed to connect to MongoDB", err);
//   });

function compareStrings(str1, str2) {
  if (str1 === str2) {
      return "The strings are equal.";
  } else {
      return "The strings are not equal.";
  }
}

// Example usage:
const string1 = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY2YmRjNjljYmE3NjU3ZmQ0ZDc0OWY5NCIsImVtYWlsIjoidGVzdEBnLmNvbSIsImlhdCI6MTcyNjY3ODYzOCwiZXhwIjoxNzI3MjgzNDM4fQ.fIRbbai85Qkggwuti6wlzDJRgeUUjLO4jYHRfos1rnc";
const string2 = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY2YmRjNjljYmE3NjU3ZmQ0ZDc0OWY5NCIsImVtYWlsIjoidGVzdEBnLmNvbSIsImlhdCI6MTcyNjY3ODYzOCwiZXhwIjoxNzI3MjgzNDM4fQ.fIRbbai85Qkggwuti6wlzDJRgeUUjLO4jYHRfos1rnc";

console.log(compareStrings(string1, string2)); // Output: The strings are equal.

