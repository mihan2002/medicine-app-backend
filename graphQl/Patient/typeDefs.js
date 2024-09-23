// typeDefs.js

const { gql } = require("apollo-server-express");

const typeDefs = gql`
  scalar Date
  type Patient {
    id: ID!
    firstName: String!
    lastName: String!
    dateOfBirth: Date
    gender: String
    languagesSpoken: String
    email: String!
    googleId: String
    existingConditions: String
    completedAppointments: [CompletedAppointment]
    upcomingAppointments: [UpcomingAppointment]
    createdAt: String!
    updatedAt: String!
  }

  type Query {
    getPatientByID: Patient
    getPatientByGoogleId(googleId: String!): Patient
    getAllPatients: [Patient!]
  }
`;

module.exports = typeDefs;
