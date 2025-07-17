const express = require('express');
const reviewRouter = express.Router();
const reviewController = require('../controller/reviewController.js');
const authController = require('../controller/authController.js');

reviewRouter
  .route('/')
  .get(authController.protect, reviewController.getAllReviews)
  .post(
    authController.protect,
    authController.restrictTo('user'),
    reviewController.createReview,
  );

module.exports = reviewRouter;
