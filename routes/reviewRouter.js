const express = require('express');
const reviewRouter = express.Router({ mergeParams: true });
const reviewController = require('../controller/reviewController.js');
const authController = require('../controller/authController.js');

reviewRouter.use(authController.protect);
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
  .delete(
    authController.restrictTo('admin', 'user'),
    reviewController.deleteReview,
  )
  .patch(
    authController.restrictTo('admin', 'user'),
    reviewController.updateReview,
  )
  .get(reviewController.getReview);
module.exports = reviewRouter;
