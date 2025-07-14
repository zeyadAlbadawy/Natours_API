const User = require('../models/userModel.js');

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
};
