const mongoose = require('mongoose');
const Tour = require('../models/tourModel.js');
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
  // this.populate({
  //   path: 'tour',
  //   select: 'name',
  // }).populate({
  //   path: 'user',
  //   select: 'name photo',
  // });

  this.populate({
    path: 'user',
    select: 'name photo',
  });

  next();
});

// Statics methods are available on the document it self not in the instances
reviewSchema.statics.calcAvgRatings = async function (tourId) {
  const stats = await this.aggregate([
    { $match: { tour: tourId } },
    {
      $group: {
        _id: '$tour',
        noOfRatings: { $sum: 1 },
        ratingsAvg: { $avg: '$rating' },
      },
    },
  ]);

  // Presist this data
  if (stats.length > 1)
    await Tour.findByIdAndUpdate(tourId, {
      ratingsAverage: stats[0].ratingsAvg,
      ratingsQuantity: stats[0].noOfRatings,
    });
  else
    await Tour.findByIdAndUpdate(tourId, {
      ratingsAverage: 4.5,
      ratingsQuantity: 0,
    });
  console.log(stats);
};

reviewSchema.post('save', function () {
  // This points to the current doc
  // this.constructor.functionName in side the middleware = model.fucntionName
  this.constructor.calcAvgRatings(this.tour);
});

reviewSchema.post(/^findOneAnd/, async function (doc) {
  if (doc) await doc.constructor.calcAvgRatings(doc.tour);
});

reviewSchema.index({ user: 1, tour: 1 }, { unique: true });

const Review = mongoose.model('Review', reviewSchema);
module.exports = Review;
