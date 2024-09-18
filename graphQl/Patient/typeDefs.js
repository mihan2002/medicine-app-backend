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
    completedAppointments: [Appointment]
    upcomingAppointments: [Appointment]
    createdAt: String!
    updatedAt: String!
  }

  type Doctor {
    firstName: String!
    lastName: String!
    specialization: String!
    email: String!
  }

  type Appointment {
    date: String!
    reason: String!
    notes: String
    prescription: [String]
    doctor: Doctor!
  }

  type Query {
    getPatientByID: Patient
    getPatientByGoogleId(googleId: String!): Patient
    getAllPatients: [Patient!]
  }
`;

module.exports = typeDefs;
