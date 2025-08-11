const User = require('../models/userModel.js');
const AppError = require('../utils/appError.js');
const appError = require('../utils/appError.js');
const handler = require('./handlerFactory.js');
const multer = require('multer');

const multerStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'public/img/users');
  },
  filename: (req, file, cb) => {
    const ext = file.mimetype.split('/')[1];
    // The first arg is no error
    cb(null, `user-${req.user.id}-${Date.now()}.${ext}`);
  },
});

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

const multerSetDestination = upload.single('photo');

const filterObj = (obj, ...allowedFields) => {
  const res = {};
  Object.keys(obj).forEach((elm) => {
    if (allowedFields.includes(elm)) {
      res[elm] = obj[elm];
    }
  });
  return res;
};

const updateMe = async (req, res, next) => {
  try {
    // Create error if user posted password!
    console.log(req.file);
    if (req.body.password || req.body.passwordConfirm)
      return next(
        new appError(
          `This Route is not for updating the current password! Try to PATCH to updateMyPassword Route`,
          400,
        ),
      );

    const filterdObject = filterObj(req.body, 'name', 'email');
    if (req.file) filterdObject.name = req.file.filename;

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
const getMe = (req, res, next) => {
  req.params.id = req.user.id;
  next();
};
const getAllUsers = handler.getAll(User);
const getUser = handler.getOne(User);
const updateUser = handler.updateOne(User);
const createNewUser = handler.createOne(User);
const deleteUser = handler.deleteOne(User);

module.exports = {
  updateUser,
  getUser,
  createNewUser,
  multerSetDestination,
  getAllUsers,
  deleteUser,
  updateMe,
  deleteMe,
  getMe,
};
