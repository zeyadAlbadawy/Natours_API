const mongoose = require('mongoose');
// text for review rating , createdAt, reference to tour and user

const reviewSchema = new mongoose.Schema(
  {
    review: {
      type: String,
      required: [true, 'A Review can not be empty'],
    },
    rating: {
      type: Number,
      max: [5, 'A Review Rating Must be less than 5'],
      min: [1, 'A Review Rating Must be greater than 1'],
      required: [true, 'A Review Rating Can Not Be Empty '],
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },

    tourGuides: {
      type: mongoose.Schema.ObjectId,
      ref: 'Tour',
    },
    userGuides: {
      type: mongoose.Schema.ObjectId,
      ref: 'User',
    },
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  },
);

const Review = mongoose.model('Review', reviewSchema);
module.exports = Review;
