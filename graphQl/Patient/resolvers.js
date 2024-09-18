// resolvers.js

const Patient = require("../../model/patientModel"); // Import the Patient model

const resolvers = {
  Query: {
    getPatientByID: async (_, __, context) => {
      try {
        const user = context.user;
        const patient = await Patient.getPatient(user);
        return patient;
      } catch (error) {
        throw new Error(error.message);
      }
    },
    getPatientByGoogleId: async (_, { googleId }) => {
      try {
        const patient = await Patient.getPatient(googleId);
        if (!patient) {
          throw new Error("Patient not found.");
        }
        return patient;
      } catch (error) {
        throw new Error(error.message);
      }
    },
    getAllPatients: async () => {
      try {
        const patients = await Patient.find();
        return patients;
      } catch (error) {
        throw new Error(error.message);
      }
    },
  },
};

module.exports = resolvers;
