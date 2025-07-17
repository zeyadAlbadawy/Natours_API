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

    // There is not an array so that it is parent referencing which means review points to a tour and a user
    // But the user or tour don't know the reviews associated with them!
    // This also can be implemented using pagination
    tour: {
      type: mongoose.Schema.ObjectId,
      ref: 'Tour',
    },
    user: {
      type: mongoose.Schema.ObjectId,
      ref: 'User',
    },
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  },
);

reviewSchema.pre(/^find/, function (next) {
  this.populate({
    path: 'tour',
    select: 'name',
  }).populate({
    path: 'user',
    select: 'name photo',
  });
  next();
});

const Review = mongoose.model('Review', reviewSchema);
module.exports = Review;
