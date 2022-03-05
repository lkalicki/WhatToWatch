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
    actors: [String]
    description: String
    title: String
    image: String
    link: String
  }

  input InputMovie {
    movieId: String
    actors: [String]
    title: String
    description: String
    image: String
    link: String
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