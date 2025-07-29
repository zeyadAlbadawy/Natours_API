const AppError = require('../utils/appError.js');
const Tour = require('../models/tourModel.js');

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
    res.status(200).render('tour', { title: 'The First Hiker', tour });
  } catch (err) {
    next(err);
  }
};

module.exports = { getOverview, getTour };
