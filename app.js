const express = require('express');
const morgan = require('morgan');
const app = express();
app.use(express.static('public'));

const tourRouter = require('./routes/tourRoutes.js');
const userRouter = require(`./routes/userRoutes.js`);

// Middle-ware
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

module.exports = app;
