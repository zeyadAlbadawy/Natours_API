const express = require('express');
const morgan = require('morgan');
const AppError = require('./utils/appError.js');
const globalErrorHandeler = require('./controller/errorController.js');
const app = express();

const tourRouter = require('./routes/tourRoutes.js');
const userRouter = require(`./routes/userRoutes.js`);

// Middle-ware
app.use(express.static('public'));
app.use(express.json());
app.use(express.static(`${__dirname}/public`));
app.use((req, res, next) => {
  req.reqTime = new Date().toISOString();
  next();
});
if (process.env.NODE_ENV === 'development') app.use(morgan('dev'));

// Handelers
app.use('/api/v1/tours', tourRouter);
app.use('/api/v1/users', userRouter);

// If the router didn't catched from the above routers then it will enter here!
app.all('*', (req, res, next) => {
  next(new AppError(`Can not find ${req.originalUrl}`, 404));
});

// For the error occurs this will handle all of them
app.use(globalErrorHandeler);

module.exports = app;
