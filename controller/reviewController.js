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
