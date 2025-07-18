const express = require('express');
const reviewRouter = express.Router({ mergeParams: true });
const reviewController = require('../controller/reviewController.js');
const authController = require('../controller/authController.js');

reviewRouter
  .route('/')
  .get(reviewController.getAllReviews)
  .post(
    authController.protect,
    authController.restrictTo('user'),
    reviewController.createReviewMiddleWare,
    reviewController.createReview,
  );

reviewRouter
  .route('/:id')
  .delete(reviewController.deleteReview)
  .patch(reviewController.updateReview)
  .get(reviewController.getReview);
module.exports = reviewRouter;
