const express = require('express');
const router = express.Router();
const viewsController = require('../controller/viewsController.js');
const authController = require('../controller/authController.js');
const bookingController = require('../controller/bookingController.js');

router.get('/me', authController.protect, viewsController.getAccount);
router.use(authController.isLoggedIn);
router.get(
  '/',
  bookingController.createBookingCheckout,
  authController.protect,
  viewsController.getOverview,
);

router
  .route('/my-bookings')
  .get(authController.protect, viewsController.getMyTours);
router.get('/tour/:slug', authController.protect, viewsController.getTour);
router.get('/login', viewsController.getLoginForm);
router.get('/signup', viewsController.getSignupForm);

router
  .route('/submit-user-data')
  .post(authController.protect, viewsController.updateUserData);
module.exports = router;
