const express = require('express');
const authController = require('../controller/authController');
const bookingController = require('../controller/bookingController.js');
const bookingRouter = express.Router();

bookingRouter.use(authController.protect);
bookingRouter
  .route('/checkout-session/:tourId')
  .get(authController.protect, bookingController.getCheckoutSession);

bookingRouter.use(authController.restrictTo('admin', 'lead-guide'));

bookingRouter
  .route('/')
  .get(bookingController.getAllBooking)
  .post(bookingController.createBooking);

bookingRouter
  .route('/:id')
  .get(bookingController.getBooking)
  .patch(bookingController.updateBooking)
  .delete(bookingController.deleteBooking);
module.exports = bookingRouter;
