const { gql } = require("apollo-server");

module.exports = gql`
  type Patient {
    firstName: String!
    lastName: String!
    dateOfBirth: String!
    gender: String!
    email: String!
    password: String!
    completedAppointments: [Appointment]
    upcomingAppointments: [Appointment]
    createdAt: String!
    updatedAt: String!
  }

  type Appointment {
    id: ID!
    date: String!
    time: String!
    doctor: String!
    notes: String
    createdAt: String!
    updatedAt: String!
  }

  input PatientInput {
    firstName: String!
    lastName: String!
    dateOfBirth: String!
    gender: String!
    email: String!
    password: String!
  }

  type Query {
    getPatientByEmail(email: String!): Patient!
    getAllPatients: [Patient]
  }

  type Mutation {
    deletePatient(email:String!):Boolean
    editPatient(patientInput: PatientInput!): Boolean!
  }
`;
