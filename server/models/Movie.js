const mongoose = require('mongoose');
const { Schema } = mongoose;

// This is a subdocument schema, it won't become its own model but we'll use it as the schema for the User's `savedMovies` array in User.js
const movieSchema = new Schema({
  // saved movie id from Movies
  movieId: { 
    type: String, 
    required: true, 
  },
  title: { 
    type: String, 
    required: true, 
  },
  imageUrl: { 
    type: String, 
  },
 type: { 
    type: String, 
  },
  year: { 
    type: String, 
  },
});

module.exports = movieSchema;