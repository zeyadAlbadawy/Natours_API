const mongoose = require('mongoose');
const { default: isEmail } = require('validator/lib/isEmail');
const { validate } = require('./tourModel');
const { ServerMonitoringMode } = require('mongodb');
const userSchema = new Schema({
  name: {
    type: String,
    minLength: [10, 'A user name must be at min 10 char'],
    maxLength: [40, 'A user name must be at most 40 char'],
    unique: [true, 'A user name must be unique'],
  },
  email: {
    type: String,
    required: [true, 'Email is required!'],
    validate: {
      validator: validator.isEmail,
      message: 'The Mail Entered Is Not Valid!',
    },
    unique: true,
    lowercase: true,
  },

  photo: {
    type: String,
  },

  password: {
    type: String,
    required: ['True', 'User Password is required'],
    minLength: [8, 'The Password should be greater than 8'],
  },

  passwordConfirm: {
    type: String,
    required: ['True', 'User Password Confirmation is required'],
    validate: {
      validator: function (val) {
        return val === this.password;
      },
      message: `The Passwords Doesn't Match`,
    },
  },
});

const User = mongoose.model('User', userSchema);
module.exports = User;
