const Tour = require('../models/tourModel.js');
const AppError = require('../utils/appError.js');
const factory = require('./handlerFactory.js');
const multer = require('multer');
const sharp = require('sharp');

// Images And Covers Uploads

const multerStorage = multer.memoryStorage();

const multerFilter = (req, file, cb) => {
  if (file.mimetype.startsWith('image')) {
    cb(null, true);
  } else {
    cb(new AppError('Not an image, please upload only images', 400), false);
  }
};

const upload = multer({
  storage: multerStorage,
  fileFilter: multerFilter,
});

// Middleware for upload multiple imgs
const uploadTourImgs = upload.fields([
  {
    name: 'imageCover',
    maxCount: 1,
  },
  {
    name: 'images',
    maxCount: 3,
  },
]);

const resizeTourImages = async (req, res, next) => {
  try {
    if (!req.files.imageCover || !req.files.images) return next();
    // console.log(req.files);

    // Process The Cover Image
    req.body.imageCover = `tour-${req.params.id}-${Date.now()}-cover.jpeg`;
    await sharp(req.files.imageCover[0].buffer)
      .resize(2000, 1333)
      .toFormat('jpeg')
      .jpeg({ quality: 90 })
      .toFile(`public/img/tours/${req.body.imageCover}`); //save the image after getting it from buffer

    // Process The Other images
    req.body.images = [];
    await Promise.all(
      req.files.images.map(async (file, i) => {
        const imageName = `tour-imgs-${req.params.id}-${Date.now()}-${i + 1}.jpeg`;
        await sharp(file.buffer)
          .resize(2000, 1333)
          .toFormat('jpeg')
          .jpeg({ quality: 90 })
          .toFile(`public/img/tours/${imageName}`); //save the image after getting it from buffer
        req.body.images.push(imageName);
      }),
    );
    next();
  } catch (err) {
    next(err);
  }
};
const aliasTopTours = (req, res, next) => {
  req.query.limit = '5';
  req.query.sort = '-ratingsAverage,price';
  req.query.fields = 'name,price,ratingsAverage,summary,difficulty';
  next();
};

const createNewTour = factory.createOne(Tour);
const deleteTour = factory.deleteOne(Tour);
const updateTour = factory.updateOne(Tour);
const getTour = factory.getOne(Tour, { path: 'reviews' });
const getAllTours = factory.getAll(Tour);

// const getAllTours = async (req, res, next) => {
//   try {
//     const features = new APIfeatures(Tour.find(), req.query);
//     features.filter().sorting().limitation().pagination();
//     const tours = await features.query;

//     res.status(200).json({
//       status: 'Success',
//       results: tours.length,
//       data: {
//         tours,
//       },
//     });
//   } catch (err) {
//     next(err);
//   }
// };
// const getTour = async (req, res, next) => {
//   try {
//     const tour = await Tour.findById(req.params.id).populate('reviews');
//     if (!tour)
//       return next(
//         new AppError(`Can not find tour with id ${req.params.id}`, 404),
//       );
//     res.status(200).json({
//       status: 'Success',
//       data: {
//         tour,
//       },
//     });
//   } catch (err) {
//     next(err);
//   }
// };

// const createNewTour = async (req, res, next) => {
//   try {
//     const newTour = await Tour.create(req.body);
//     res.status(201).json({
//       status: 'Success',
//       data: { tour: newTour },
//     });
//   } catch (err) {
//     next(err);
//   }
// };

// const updateTour = async (req, res) => {
//   try {
//     const tour = await Tour.findByIdAndUpdate(req.params.id, req.body, {
//       new: true,
//       runValidators: true,
//     });
//     res.status(200).json({
//       status: 'Success',
//       data: { tour },
//     });
//   } catch (err) {
//     next(err);
//   }
// };
// const deleteTour = async (req, res, next) => {
//   try {
//     const tour = await Tour.findById(req.params.id);
//     if (!tour)
//       return next(
//         new AppError(`Can not find tour with id ${req.params.id}`, 404),
//       );
//     await Tour.findByIdAndDelete(req.params.id);
//     res.status(204).json({
//       status: 'Success',
//       message: 'Tour deleted Successfully',
//     });
//   } catch (err) {
//     next(err);
//   }
// };

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

const getToursWithin = async (req, res, next) => {
  try {
    // From the center([lng, lat]) with distance Find the tours
    const { distance, latlng, unit } = req.params;
    const [lat, lng] = latlng.split(',');
    const radius = unit === 'mi' ? distance / 3963.2 : distance / 6378.1;
    if (!lat || !lng)
      next(
        new AppError(
          `Please Provide Lattitude And Langitude in the format of lat,lng`,
          400,
        ),
      );

    const tours = await Tour.find({
      startLocation: { $geoWithin: { $centerSphere: [[lng, lat], radius] } },
    });
    res.status(200).json({
      status: 'Success',
      result: tours.length,
      data: {
        data: tours,
      },
    });
  } catch (err) {
    next(err);
  }
};

const getDistances = async (req, res, next) => {
  // Calculate the distance from point to all the tours
  try {
    const { latlng, unit } = req.params;
    const [lat, lng] = latlng.split(',');
    const muliplier = unit === 'mi' ? 0.000621371 : 0.001;
    if (!lat || !lng)
      return next(
        new AppError(
          `Please Provide Lattitude And Langitude in the format of lat,lng`,
          400,
        ),
      );

    // This will get the distance from e
    const distances = await Tour.aggregate([
      {
        $geoNear: {
          near: {
            type: 'Point',
            coordinates: [lng * 1, lat * 1],
          },
          distanceField: 'distance',
          distanceMultiplier: muliplier,
        },
      },
      {
        $project: {
          distance: 1,
          name: 1,
        },
      },
    ]);

    res.status(200).json({
      status: 'Success',
      data: {
        data: distances,
      },
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
  getDistances,
  aliasTopTours,
  getTourStats,
  getMonthlyPlan,
  uploadTourImgs,
  getToursWithin,
  resizeTourImages,
};
