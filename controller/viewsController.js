const AppError = require('../utils/appError.js');
const Tour = require('../models/tourModel.js');
const User = require('../models/userModel.js');
const Booking = require('../models/bookingModel.js');

const getOverview = async (req, res, next) => {
  const tours = await Tour.find();
  res.status(200).render('overview', { title: 'All Tours', tours });
};

const getTour = async (req, res, next) => {
  try {
    const slug = req.params.slug;
    const tour = await Tour.findOne({ slug }).populate({
      path: 'reviews',
      fields: 'review rating user',
    });
    if (!tour)
      return next(new AppError(`Can not find tour with this name!`, 404));
    res.status(200).render('tour', { title: `${tour.name} tour`, tour });
  } catch (err) {
    next(err);
  }
};

const getLoginForm = async (req, res, next) => {
  try {
    res.status(200).render('login', { title: 'Log into your account' });
  } catch (err) {
    next(err);
  }
};

const getAccount = async (req, res, next) => {
  try {
    res.status(200).render('account', { title: 'Your account' });
  } catch (err) {
    next(err);
  }
};

const updateUserData = async (req, res, next) => {
  try {
    const foundUser = await User.findByIdAndUpdate(
      req.user.id,
      {
        name: req.body.name,
        email: req.body.email,
      },
      {
        new: true,
        runValidators: true,
      },
    );
    res.status(200).render('account', {
      title: 'You Account',
      user: foundUser,
    });
  } catch (err) {
    next(err);
  }
};

const getMyTours = async (req, res, next) => {
  try {
    const booking = await Booking.find({ user: req.user.id });
    const tourID = booking.map((elm) => elm.tour);
    const tours = await Tour.find({ _id: { $in: tourID } });
    res.status(200).render('overview', {
      title: 'My Tours',
      tours,
    });
  } catch (err) {
    next(err);
  }
};
module.exports = {
  getMyTours,
  getOverview,
  getTour,
  getLoginForm,
  getAccount,
  updateUserData,
};
