const appError = require('../utils/appError.js');

const sendErrorDev = (err, res) => {
  res.status(err.statusCode).json({
    status: err.status,
    message: err.message,
    error: err,
    stack: err.stack,
  });
};

const handleCastError = (err) => {
  return new appError(`Invalid ${err.path} of ${err.value}`, 400);
};

const handleJWTErrorAuth = () =>
  new appError(`Invalid token, Please try to login again`, 401);

const handleJWTExpiredAuth = () =>
  new appError(`The Token has been expired, Please try to login again`, 401);

const handleDupicateFields = (err) => {
  const value = err.errmsg.match(/(["'])(?:(?=(\\?))\2.)*?\1/)[0];
  return new appError(
    `Duplicate fields value of ${value}, please enter another value`,
    400,
  );
};

const handleValidationFields = (err) => {
  const message = Object.values(err.errors)
    .map((elm) => elm.message)
    .join('. ');
  return new appError(`${message}`, 400);
};

const sendErrorProd = (err, res) => {
  // Operational error means the error we created ourselves that didn't match a certain criteria
  if (err.isOperational) {
    res.status(err.statusCode).json({
      status: err.status,
      message: err.message,
    });
    // Otherwise => unexpected errors don't leak the inforamtion
  } else {
    res.status(500).json({
      status: 'Error',
      message: 'Something went wrong!',
    });
  }
};
const globalErrorHandeler = (err, req, res, next) => {
  err.status = err.status || 'error';
  err.statusCode = err.statusCode || 500;
  if (process.env.NODE_ENV === 'development') sendErrorDev(err, res);
  else if (process.env.NODE_ENV === 'production') {
    let error = { ...err };
    if (err.name === 'CastError') error = handleCastError(err);
    if (err.code === 11000) error = handleDupicateFields(err);
    if (err.name === 'ValidationError') error = handleValidationFields(err);
    if (err.name === 'JsonWebTokenError') error = handleJWTErrorAuth(error);
    if (err.name === 'TokenExpiredError') error = handleJWTExpiredAuth(err);
    sendErrorProd(error, res);
  }

  next();
};

module.exports = globalErrorHandeler;
