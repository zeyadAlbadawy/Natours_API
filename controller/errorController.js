const sendErrorDev = (err, res) => {
  res.status(err.statusCode).json({
    status: err.status,
    error: err,
    message: err.message,
    stack: err.stack,
  });
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
  else if (process.env.NODE_ENV === 'production') sendErrorProd(err, res);

  next();
};

module.exports = globalErrorHandeler;
