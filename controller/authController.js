const User = require('../models/userModel.js');
const jwt = require('jsonwebtoken');
const { promisify } = require('util');
const appError = require('../utils/appError.js');
const Email = require('../utils/mail.js');
const crypto = require('crypto');

const createSendToken = (user, statusCode, res) => {
  const token = assignToken(user._id);
  const cookieOptions = {
    expires: new Date(
      Date.now() + process.env.JWT_COOKIE_EXPIRESIN * 24 * 60 * 60 * 1000,
    ),
    httpOnly: true,
  };

  if (process.env.NODE_ENV === 'production') cookieOptions.secure = true;
  user.password = undefined;
  res.cookie('jwt', token, cookieOptions);
  res.status(statusCode).json({
    status: 'Success',
    token,
    data: { user },
  });
};
const assignToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });
};

const logout = (req, res) => {
  res.cookie('jwt', 'loggedOutUser', {
    expires: new Date(Date.now() + 10 * 1000),
    httpOnly: true,
  });
  res.status(200).json({ status: 'success' });
};

const signup = async (req, res, next) => {
  try {
    // Once we create new user or the user sign up the user must be automatically logged in
    // This happens by creating JWT And Sending it directly to the client
    const newUser = await User.create({
      name: req.body.name,
      email: req.body.email,
      password: req.body.password,
      passwordConfirm: req.body.passwordConfirm,
    });

    const url = `${req.protocol}://${req.get('host')}/me`;
    await new Email(newUser, url).sendWelcome();
    // The first params of jwt.assign is the property that can be unique and travels between server and client
    createSendToken(newUser, 201, res);
  } catch (err) {
    console.log(err);

    next(err);
  }
};

const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    // Check if email and password exists
    if (!email || !password)
      return next(new appError(`PLease Enter the email and password `));
    // check if the user exist
    const user = await User.findOne({ email }).select('+password');
    if (!user || !(await user.correctPassword(password, user.password)))
      return next(
        new appError(
          `The User's Email: ${email} or password is not correct! try logging with different credentials`,
          401,
        ),
      );
    // if everything is ok send the token
    createSendToken(user, 200, res);
  } catch (err) {
    next(err);
  }
};

// For the protected Route
// 1 ) in the login or sign up, we create jwt and send it via respose to the Client
// 2 ) when we try to access any protected Route, we took this JWT token and pass it to the protect handler middleware
//     Throught Authorized Bearer Token Header
// 3 ) Protect Middleware checks if the authorized token exists then it will take it from the header.
// 4 ) Using jwt.verify and passing the secret key to it, will leades to checking the token verification based upon the security key!
//     If not correct it will through an error which will be handled in the global handler middle-ware
// 5 ) after that we still need to check if the user still exists based upon the id stored in JWT Token!
// 6 ) Check if the password has been changed after the token has been issued if so, return error to login again with new JWT!

const protect = async (req, res, next) => {
  try {
    // Get The Token And check if it is there
    let token;
    if (
      req.headers.authorization &&
      req.headers.authorization.startsWith('Bearer')
    ) {
      token = req.headers.authorization.split(' ')[1];
    } else if (req.cookies.jwt) {
      token = req.cookies.jwt;
    }
    if (!token) return next(new appError(`You are not logged in, Try Again! `));

    // verification token
    const decoded = await promisify(jwt.verify)(token, process.env.JWT_SECRET);

    //check if the user still exists

    const freshUser = await User.findById(decoded.id);
    if (!freshUser)
      return next(
        new appError(
          `The User is no longer exist try again with different user`,
          401,
        ),
      );

    // Check if the user change password after jwt has been issued
    if (freshUser.isPasswordChanged(decoded.iat)) {
      return next(
        new appError(
          `The Current user has changed his password recently, Try Login again!`,
          401,
        ),
      );
    }
    req.user = freshUser;
    res.locals.user = freshUser;
    console.log(freshUser);

    next();
  } catch (err) {
    next(err);
  }
};

const isLoggedIn = async (req, res, next) => {
  try {
    // Get The Token And check if it is there
    if (req.cookies.jwt) {
      // Vertify if the token is valid
      const decoded = await promisify(jwt.verify)(
        req.cookies.jwt,
        process.env.JWT_SECRET,
      );

      // Check if the user is exist

      const freshUser = await User.findById(decoded.id);
      if (!freshUser) return next();

      // Check if the user change password after jwt has been issued
      if (freshUser.isPasswordChanged(decoded.iat)) return next();
      res.locals.user = freshUser;
    }
    return next();
  } catch (err) {
    return next();
  }
};

const restrictTo = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role))
      return next(
        new appError(
          `As ${req.user.role} Don't have permission to do this action`,
          403,
        ),
      );
    next();
  };
};

const forgetPassword = async (req, res, next) => {
  let foundUser = undefined;
  try {
    // Get User based upon the posted mail
    const user = await User.findOne({ email: req.body.email });
    if (!user)
      return next(
        new appError(`The User with ${req.body.email} not found`, 404),
      );
    foundUser = user;
    // generate the random reset token
    const token = user.createPasswordResetToken();
    await user.save({ validateBeforeSave: false });
    // Send it to the user mail
    const resetURL = `${req.protocol}://${req.get('host')}/api/v1/users/resetPassword/${token}`;
    await new Email(user, resetURL).sendPasswordReset();

    res.status(200).json({
      status: 'Success',
      message: 'The Token has sent to the user mail!',
    });
  } catch (err) {
    foundUser.passwordResetToken = undefined;
    foundUser.passwordExpiredResetToken = undefined;
    await foundUser.save({ validateBeforeSave: false });
    next(new appError('There is an error sending the token', 500));
  }
};

const resetPassword = async (req, res, next) => {
  try {
    // Get The User based upon the token
    // The Reset token enter the database in encrypted format
    const encryptedToken = crypto
      .createHash('sha256')
      .update(req.params.token)
      .digest('hex');

    const foundUser = await User.findOne({
      passwordResetToken: encryptedToken,
      passwordExpiredResetToken: { $gt: Date.now() },
    });
    if (!foundUser)
      return next(
        new appError(
          `the requested user not found or the token has been expired`,
          404,
        ),
      );
    // if the token has not expired, and this is a user then set the password
    //update changedAt password
    const { password, passwordConfirm } = req.body;
    if (!password || !passwordConfirm) {
      return next(
        new appError('Please provide both password and passwordConfirm', 400),
      );
    }
    foundUser.password = password;
    foundUser.passwordConfirm = passwordConfirm;
    foundUser.passwordExpiredResetToken = undefined;
    foundUser.passwordResetToken = undefined;
    await foundUser.save();
    // Log the user in
    createSendToken(foundUser, 200, res);
  } catch (err) {
    next(err);
  }
};

const updateCurrentUserPassword = async (req, res, next) => {
  try {
    // 1) Get the user who logged in => Req.user Comes from protect middleware
    const currentUser = await User.findById(req.user.id).select('+password');
    const { password, passwordNew, passwordNewConfirm } = req.body;
    // 2) check if the current user password is correct
    if (
      !currentUser ||
      !(await currentUser.correctPassword(password, currentUser.password))
    )
      return next(
        new appError(
          `The Current password is not correct or the user not found. Try Login Again!`,
          401,
        ),
      );

    // 3) update the password
    currentUser.password = passwordNew;
    currentUser.passwordConfirm = passwordNewConfirm;
    await currentUser.save();

    // 4) send JWT again to the user
    createSendToken(currentUser, 200, res);
  } catch (err) {
    next(err);
  }
};

module.exports = {
  signup,
  login,
  logout,
  protect,
  restrictTo,
  forgetPassword,
  resetPassword,
  updateCurrentUserPassword,
  isLoggedIn,
};
