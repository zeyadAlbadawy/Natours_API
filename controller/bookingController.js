const appError = require('../utils/appError.js');
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const Tour = require('../models/tourModel.js');
const Booking = require('../models/bookingModel.js');
const handleFactory = require('./handlerFactory.js');
const getCheckoutSession = async (req, res, next) => {
  try {
    const tour = await Tour.findById(req.params.tourId);

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      success_url: `${req.protocol}://${req.get('host')}/?tour=${req.params.tourId}&user=${req.user.id}&price=${tour.price}`,
      cancel_url: `${req.protocol}://${req.get('host')}/tour/${tour.slug}`,
      client_reference_id: req.params.tourId,
      customer_email: req.user.email,
      line_items: [
        {
          price_data: {
            currency: 'usd',
            product_data: {
              name: `${tour.name} Tour`,
              description: tour.summary,
              images: [`https://www.natours.dev/img/tours/${tour.imageCover}`],
            },
            unit_amount: tour.price * 100,
          },
          quantity: 1,
        },
      ],
      mode: 'payment',
    });

    res.status(200).json({
      status: 'success',
      session,
    });
  } catch (err) {
    next(err);
  }
};

const createBookingCheckout = async (req, res, next) => {
  try {
    const { tour, user, price } = req.query;
    if (!tour && !price && !user) return next();

    await Booking.create({ tour, user, price });

    res.redirect(req.originalUrl.split('?')[0]);
  } catch (err) {
    next(err);
  }
};

const createBooking = handleFactory.createOne(Booking);
const getBooking = handleFactory.getOne(Booking);
const getAllBooking = handleFactory.getAll(Booking);
const updateBooking = handleFactory.updateOne(Booking);
const deleteBooking = handleFactory.deleteOne(Booking);
module.exports = {
  getBooking,
  deleteBooking,
  updateBooking,
  getAllBooking,
  getCheckoutSession,
  createBooking,
  createBookingCheckout,
};
