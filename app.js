const express = require('express');
const morgan = require('morgan');
const helmet = require('helmet');
const hpp = require('hpp');
const mongoSanitize = require('express-mongo-sanitize');
// const { xss } = require('express-xss-sanitizer');

const rateLimit = require('express-rate-limit');
const AppError = require('./utils/appError.js');
const globalErrorHandeler = require('./controller/errorController.js');
const app = express();

const tourRouter = require('./routes/tourRoutes.js');
const userRouter = require(`./routes/userRoutes.js`);

// Date Sanitization From NoSql Attacks
app.use(mongoSanitize());
// app.use(xss());

// Prevent Parameter Pollution such as duration=5&duration=9 is allowed
// Sort=duration&sort=price' is not allowed because it is not allowed in the white list fiels
app.use(
  hpp({
    whitelist: [
      'duration',
      'ratingsAverage',
      'ratingsQuantity',
      'price',
      'difficulty',
    ],
  }),
);

// Set Security Header
app.use(helmet());
// This will allow 100 requests per one hour
const limiter = rateLimit({
  max: 100,
  windowMs: 60 * 60 * 1000,
  message: 'Too Many Requests From This API. Try Again Within An Hour!',
});
// Middle-ware
app.use('/api', limiter);
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
