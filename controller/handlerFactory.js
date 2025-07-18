const AppError = require('../utils/appError.js');
const APIfeatures = require('../utils/apiFeatures.js');

const deleteOne = (Model) => async (req, res, next) => {
  try {
    const doc = await Model.findById(req.params.id);
    if (!doc)
      return next(
        new AppError(`Can not find Model with id ${req.params.id}`, 404),
      );
    await Model.findByIdAndDelete(req.params.id);
    res.status(204).json({
      status: 'Success',
      message: 'Model deleted Successfully',
    });
  } catch (err) {
    next(err);
  }
};

const updateOne = (Model) => async (req, res, next) => {
  try {
    const doc = await Model.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    if (!doc) {
      return next(
        new AppError(`No document found with ID ${req.params.id}`, 404),
      );
    }

    res.status(200).json({
      status: 'Success',
      data: { doc },
    });
  } catch (err) {
    next(err);
  }
};

const createOne = (Model) => async (req, res, next) => {
  try {
    const doc = await Model.create(req.body);
    res.status(201).json({
      status: 'Success',
      data: { doc },
    });
  } catch (err) {
    next(err);
  }
};

const getOne = (Model, queryOptions) => async (req, res, next) => {
  try {
    let query = Model.findById(req.params.id);
    if (queryOptions) query = query.populate(queryOptions);
    const doc = await query;

    if (!doc)
      return next(
        new AppError(`Can not find document with id ${req.params.id}`, 404),
      );
    res.status(200).json({
      status: 'Success',
      data: {
        doc,
      },
    });
  } catch (err) {
    next(err);
  }
};

const getAll = (Model) => async (req, res, next) => {
  try {
    let filters = {};
    if (req.params.tourId) filters = { tour: req.params.tourId };
    const features = new APIfeatures(Model.find(filters), req.query);
    features.filter().sorting().limitation().pagination();
    const docs = await features.query;

    res.status(200).json({
      status: 'Success',
      results: docs.length,
      data: {
        docs,
      },
    });
  } catch (err) {
    next(err);
  }
};
module.exports = { deleteOne, updateOne, createOne, getOne, getAll };
