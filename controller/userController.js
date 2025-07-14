const User = require('../models/userModel.js');
const appError = require('../utils/appError.js');

const filterObj = (obj, ...allowedFields) => {
  const res = {};
  Object.keys(obj).forEach((elm) => {
    if (allowedFields.includes(elm)) {
      res[elm] = obj[elm];
    }
  });
  return res;
};

const getAllUsers = async (req, res, next) => {
  try {
    const users = await User.find({});
    res.status(200).json({
      status: 'Success',
      data: { users },
    });
  } catch (err) {
    next(err);
  }
};

const updateMe = async (req, res, next) => {
  try {
    // Create error if user posted password!
    if (req.body.password || req.body.passwordConfirm)
      return next(
        new appError(
          `This Route is not for updating the current password! Try to PATCH to updateMyPassword Route`,
          400,
        ),
      );

    const filterdObject = filterObj(req.body, 'name', 'email');
    const updatedUser = await User.findByIdAndUpdate(
      req.user.id,
      filterdObject,
      {
        new: true,
        runValidators: true,
      },
    );
    res.status(200).json({
      status: 'Success',
      data: { updatedUser },
    });
  } catch (err) {
    next(err);
  }
};

const deleteMe = async (req, res, next) => {
  try {
    await User.findByIdAndUpdate(req.user.id, { active: false });
    res.status(200).json({
      status: 'Sucess',
      data: null,
    });
  } catch (err) {
    next(err);
  }
};
const createNewUser = (req, res) => {
  res.status(500).json({
    status: 'err',
    message: 'This Route Has not been implemented yet!',
  });
};

const getUser = (req, res) => {
  res.status(500).json({
    status: 'err',
    message: 'This Route Has not been implemented yet!',
  });
};

const updateUser = (req, res) => {
  res.status(500).json({
    status: 'err',
    message: 'This Route Has not been implemented yet!',
  });
};

const deleteUser = async (req, res, next) => {
  res.status(500).json({
    status: 'err',
    message: 'This Route Has not been implemented yet!',
  });
};

module.exports = {
  updateUser,
  getUser,
  createNewUser,
  getAllUsers,
  deleteUser,
  updateMe,
  deleteMe,
};
