const Tour = require('../models/tourModel.js');
const APIfeatures = require('../utils/apiFeatures.js');
const AppError = require('../utils/appError.js');

const aliasTopTours = (req, res, next) => {
  req.query.limit = '5';
  req.query.sort = '-ratingsAverage,price';
  req.query.fields = 'name,price,ratingsAverage,summary,difficulty';
  next();
};

const getAllTours = async (req, res, next) => {
  try {
    const features = new APIfeatures(Tour.find(), req.query);
    features.filter().sorting().limitation().pagination();
    const tours = await features.query;

    res.status(200).json({
      status: 'Success',
      results: tours.length,
      data: {
        tours,
      },
    });
  } catch (err) {
    next(err);
  }
};

const getTour = async (req, res, next) => {
  try {
    const tour = await Tour.findById(req.params.id);
    console.log(tour);
    if (!tour)
      return next(new AppError(`Can not find tour with id ${req.params.id}`));
    res.status(200).json({
      status: 'Success',
      data: {
        tour,
      },
    });
  } catch (err) {
    next(err);
  }
};

const createNewTour = async (req, res, next) => {
  try {
    const newTour = await Tour.create(req.body);
    res.status(201).json({
      status: 'Success',
      data: { tour: newTour },
    });
  } catch (err) {
    next(err);
  }
};

const updateTour = async (req, res) => {
  try {
    const tour = await Tour.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    res.status(200).json({
      status: 'Success',
      data: { tour },
    });
  } catch (err) {
    next(err);
  }
};

const deleteTour = async (req, res) => {
  try {
    await Tour.findByIdAndDelete(req.params.id);
    res.status(204).json({
      status: 'Success',
      message: 'Tour deleted Successfully',
    });
  } catch (err) {
    next(err);
  }
};

const getTourStats = async (req, res) => {
  try {
    const stats = await Tour.aggregate([
      {
        $match: { ratingsAverage: { $gte: 4.5 } },
      },
      {
        $group: {
          _id: '$difficulty',
          noOfTours: { $sum: 1 },
          avgRating: { $avg: '$ratingsAverage' },
          minPrice: { $min: '$price' },
          maxPrice: { $max: '$price' },
          avgPrice: { $avg: '$price' },
        },
      },
      {
        $sort: { noOfTours: 1 },
      },
    ]);

    res.status(200).json({
      stats: 'Success',
      data: { stats },
    });
  } catch (err) {
    next(err);
  }
};

const getMonthlyPlan = async (req, res) => {
  // Separate documents by their start dates
  // choose the passed year only and this will be done using match
  // group by the month
  try {
    const year = req.params.year * 1;
    const plan = await Tour.aggregate([
      { $unwind: '$startDates' },
      {
        $match: {
          startDates: {
            $gte: new Date(`${year}-01-01`),
            $lte: new Date(`${year}-12-31`),
          },
        },
      },
      {
        $group: {
          noOfTours: { $sum: 1 },
          tours: { $push: '$name' },
          _id: { $month: '$startDates' },
        },
      },
      {
        $addFields: { month: '$_id' },
      },
      { $project: { _id: 0 } },
      { $sort: { noOfTours: 1 } },
    ]);
    res.status(200).json({
      status: 'Success',
      data: { plan },
    });
  } catch (err) {
    next(err);
  }
};

module.exports = {
  updateTour,
  createNewTour,
  getTour,
  getAllTours,
  deleteTour,
  aliasTopTours,
  getTourStats,
  getMonthlyPlan,
};
