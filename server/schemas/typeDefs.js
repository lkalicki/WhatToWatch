const { gql } = require('apollo-server-express');

const typeDefs = gql`
  type User {
    _id: ID!
    username: String!
    email: String!
    movieCount: Int
    savedMovies: [Movie]
  }

  type Auth {
    token: ID!
    user: User
  }

  type Movie {
    movieId: ID!
    title: String
    imageURL: String
    type: String
    year: String
  }

  input InputMovie {
    movieId: ID!
    title: String
    imageURL: String
    type: String
    year: String
  }

  type Query {
    me: User
  }

  type Mutation {
    login(email: String!, password: String!): Auth
    addUser(username: String!, email: String!, password: String!): Auth
    saveMovie(newMovie: InputMovie!): User
    removeMovie(movieId: ID!): User
  }
`;

module.exports = typeDefs;