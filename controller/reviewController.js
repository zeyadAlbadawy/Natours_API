const Review = require('../models/reviewModel.js');
const AppError = require('../utils/appError.js');

const getAllReviews = async (req, res, next) => {
  try {
    const reviews = await Review.find();
    res.status(200).json({
      status: 'Success',
      length: reviews.length,
      data: { reviews },
    });
  } catch (err) {
    next(err);
  }
};

const createReview = async (req, res, next) => {
  try {
    if (!req.body.tour) req.body.tour = req.params.tourId;
    // This Comes from req.user in the middleware protect!
    if (!req.body.user) req.body.user = req.user.id;

    const newReview = await Review.create(req.body);
    res.status(201).json({
      status: 'Success',
      data: {
        review: newReview,
      },
    });
  } catch (err) {
    next(err);
  }
};

module.exports = { getAllReviews, createReview };
