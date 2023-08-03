const { Schema, model } = require('mongoose')

const userSchema = new Schema({
    username: {
        type: String,
        index: true, 
        unique: true
    },
    email: { 
        type: String,
        unique: true, 
        required: true },
    password: { 
        type: String, 
        required: true },
    fullName: String
  },
  {
    timeseries: true
  }
  );

  const User = model("User", userSchema);

  User.createIndexes()
  
  module.exports = User