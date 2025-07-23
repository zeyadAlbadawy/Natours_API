const express = require('express');
const tourRouter = express.Router();
const tourController = require('../controller/tourController.js');
const authController = require('../controller/authController.js');
const reviewRouter = require('../routes/reviewRouter.js');

tourRouter
  .route('/tours-within/:distance/center/:latlng/unit/:unit')
  .get(tourController.getToursWithin);
tourRouter
  .route('/distances/:latlng/unit/:unit')
  .get(tourController.getDistances);
tourRouter
  .route('/get-monthly-plan/:year')
  .get(
    authController.protect,
    authController.restrictTo('admin', 'lead-guide', 'guide'),
    tourController.getMonthlyPlan,
  );
tourRouter.route('/getTourStats').get(tourController.getTourStats);

// tourRouter
//   .route('/:tourId/reviews')
//   .post(
//     authController.protect,
//     authController.restrictTo('user'),
//     reviewController.createReview,
//   );

// POST tours/84835i75rg44456/reviews
tourRouter.use('/:tourId/reviews', reviewRouter);

tourRouter
  .route('/aliasTopTours')
  .get(tourController.aliasTopTours, tourController.getAllTours);

tourRouter
  .route('/')
  .get(tourController.getAllTours)
  .post(
    authController.protect,
    authController.restrictTo('admin', 'lead-guide'),
    tourController.createNewTour,
  );

tourRouter
  .route('/:id')
  .get(tourController.getTour)
  .patch(
    authController.protect,
    authController.restrictTo('admin', 'lead-guide'),
    tourController.updateTour,
  )
  .delete(
    authController.protect,
    authController.restrictTo('admin', 'lead-guide'),
    tourController.deleteTour,
  );

// This is called params middleware which check the req parameters such as the id
// tourRouter.param('id', tourController.checkId);

module.exports = tourRouter;
