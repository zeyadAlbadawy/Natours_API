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
  } catch (err) {
    next(err);
  }
};

const getReview = async (req, res, next) => {
  try {
    const review = await Review.findById(req.params.id);
    if (!review)
      return next(
        new AppError(`There is no any review with the id of ${req.params.id}`),
      );
    res.status();
  } catch (err) {
    next(err);
  }
};
module.exports = { getAllReviews, getReview };
