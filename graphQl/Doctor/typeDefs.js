// typeDefs.js

const { gql } = require("apollo-server-express");

const typeDefs = gql`
  scalar Date
  # Doctor Type Definition
  type Doctor {
    id: ID!
    firstName: String
    lastName: String
    imageUrl: String
    dateOfBirth: String
    gender: String
    email: String
    specialization: String
    contactNumber: String
    videoVisitHours: String
    about: String
    qualifications: [String]
    professionalBackground: String
    contactInformation: ContactInformation
    rating: Float
    professionStartedYear: Int
    languagesSpoken: String
    reviews: [Review]
    createdAt: String
    updatedAt: String
  }

  # Contact Information Type Definition
  type ContactInformation {
    phone: String
    address: String
    email: String
  }

  # Review Type Definition
  type Review {
    id: ID
    user: User
    doctor: Doctor
    rating: Float
    comment: String
    createdAt: String
    updatedAt: String
  }

  # User Type Definition (Referencing user who writes reviews)
  type User {
    id: ID
    firstName: String
    lastName: String
    userImageUrl: String
  }

  # Query Type Definition
  type Query {
    getAllDoctors: [Doctor!]!
    getDoctorById(id: ID!): Doctor
  }

  # Mutation Type Definition
  type Mutation {
    addDoctor(
      firstName: String!
      lastName: String!
      dateOfBirth: String!
      gender: String!
      email: String!
      password: String!
      specialization: String!
      contactNumber: String!
      about: String!
      qualifications: [String!]!
      professionalBackground: String!
      contactInformation: ContactInformationInput!
      professionStartedYear: Int!
      languagesSpoken: String
    ): Doctor

    # Update rating for a specific doctor
    updateDoctorRating(id: ID!): Doctor
  }

  # Input Type for Contact Information in Mutations
  input ContactInformationInput {
    phone: String!
    address: String!
    email: String!
  }
`;

module.exports = typeDefs;
