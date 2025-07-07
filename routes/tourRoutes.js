const express = require('express');
const tourRouter = express.Router();
const tourController = require('../controller/tourController.js');

tourRouter.route('/get-monthly-plan/:year').get(tourController.getMonthlyPlan);
tourRouter.route('/getTourStats').get(tourController.getTourStats);
tourRouter
  .route('/aliasTopTours')
  .get(tourController.aliasTopTours, tourController.getAllTours);
tourRouter
  .route('/')
  .get(tourController.getAllTours)
  .post(tourController.createNewTour);
tourRouter
  .route('/:id')
  .get(tourController.getTour)
  .patch(tourController.updateTour)
  .delete(tourController.deleteTour);

// This is called params middleware which check the req parameters such as the id
// tourRouter.param('id', tourController.checkId);
module.exports = tourRouter;
