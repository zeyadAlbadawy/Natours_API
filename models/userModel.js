const mongoose = require('mongoose');
const crypto = require('crypto');
const { default: isEmail } = require('validator/lib/isEmail');
const { ServerMonitoringMode } = require('mongodb');
const validator = require('validator');
const bcrypt = require('bcryptjs');
const userSchema = new mongoose.Schema({
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
    select: false,
  },

  passwordConfirm: {
    type: String,
    required: ['True', 'User Password Confirmation is required'],
    validate: {
      // Works only on create or save
      validator: function (val) {
        return val === this.password;
      },
      message: `The Passwords Doesn't Match`,
    },
  },
  active: {
    type: Boolean,
    default: true,
    select: false,
  },
  passwordChangedAt: {
    type: Date,
  },
  role: {
    type: String,
    enum: ['user', 'guide', 'lead-guide', 'admin'],
    default: 'admin',
  },
  passwordResetToken: String,
  passwordExpiredResetToken: Date,
});

userSchema.pre(/^find/, function (next) {
  this.find({ active: { $ne: false } });
  next();
});

userSchema.pre('save', function (next) {
  if (!this.isModified('password') || this.isNew) return next();
  this.passwordChangedAt = Date.now();
  next();
});

userSchema.pre('save', async function (next) {
  // If the password is not modifies then skip
  if (!this.isModified('password')) return next();
  // Other wise encrypt the password and store it
  this.password = await bcrypt.hash(this.password, 12);
  this.passwordChangedAt = Date.now() - 1000;
  this.passwordConfirm = undefined;
  next();
});

userSchema.methods.correctPassword = function (
  enteredPassword,
  hashedPassword,
) {
  return bcrypt.compare(enteredPassword, hashedPassword);
};

userSchema.methods.createPasswordResetToken = function () {
  const resetToken = crypto.randomBytes(32).toString('hex');
  // Hash the created token and store it hashed in the database
  this.passwordResetToken = crypto
    .createHash('sha256')
    .update(resetToken)
    .digest('hex');

  this.passwordExpiredResetToken = Date.now() + 10 * 60 * 1000;
  return resetToken;
};

userSchema.methods.isPasswordChanged = function (jwtTimeStamp) {
  if (this.passwordChangedAt) {
    const passwordChanged = parseInt(
      this.passwordChangedAt.getTime() / 1000,
      10,
    );
    return jwtTimeStamp < passwordChanged;
  }
  return false;
};
const User = mongoose.model('User', userSchema);
module.exports = User;
