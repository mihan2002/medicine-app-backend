const Patient = require("../model/patientModel");

module.exports = {
  Query: {
    // Get a specific patient by email
    async getPatientByID(_, id,context) {
      return await Patient.findOne({ _id: context.user });
    },
    // Get all patients with an optional limit on the number returned
    async getAllPatients() {
      return await Patient.find({});
    },
  },

  Mutation: {
    

    // Delete a patient by ID
    async deletePatient(_, { email }) {
      const wasDeleted = (await Patient.deleteOne({ email: email }))
        .deletedCount;
      return wasDeleted;
    },

    // Edit patient details by ID
    async editPatient(
      _,
      {
        patientInput: {
          firstName,
          lastName,
          dateOfBirth,
          gender,
          email,
          password,
        },
      }
    ) {
      const wasEdited = (
        await Patient.updateOne(
          { email: email },
          {
            firstName: firstName,
            lastName: lastName,
            dateOfBirth: dateOfBirth,
            gender: gender,
            email: email,
            password: password,
          }
        )
      ).modifiedCount;
      return wasEdited;
    },
  },
};
