const Review = require('../models/reviewModel.js');
const AppError = require('../utils/appError.js');
const handler = require('./handlerFactory.js');

const createReviewMiddleWare = (req, res, next) => {
  if (!req.body.tour) req.body.tour = req.params.tourId;
  // This Comes from req.user in the middleware protect!
  if (!req.body.user) req.body.user = req.user.id;
  next();
};

// const getAllReviews = async (req, res, next) => {
//   try {
//     let reviews;
//     if (req.params.tourId)
//       reviews = await Review.find({ tour: req.params.tourId });
//     else reviews = await Review.find();
//     reviews = res.status(200).json({
//       status: 'Success',
//       length: reviews.length,
//       data: { reviews },
//     });
//   } catch (err) {
//     next(err);
//   }
// };

// const createReview = async (req, res, next) => {
//   try {
//     const newReview = await Review.create(req.body);
//     res.status(201).json({
//       status: 'Success',
//       data: {
//         review: newReview,
//       },
//     });
//   } catch (err) {
//     next(err);
//   }
// };

const getAllReviews = handler.getAll(Review);
const deleteReview = handler.deleteOne(Review);
const updateReview = handler.updateOne(Review);
const createReview = handler.createOne(Review);
const getReview = handler.getOne(Review);
module.exports = {
  getAllReviews,
  createReview,
  getReview,
  deleteReview,
  updateReview,
  createReview,
  createReviewMiddleWare,
};
