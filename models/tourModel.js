const mongoose = require('mongoose');

const tourSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'A tour must have a name'],
    unique: true,
    trim: true,
  },
  ratingsAverage: {
    type: Number,
    default: 4.5,
  },

  ratingsQuantity: {
    type: Number,
    default: 0,
  },

  price: {
    type: Number,
    required: [true, 'A tour must has a price!'],
  },
  duration: {
    type: Number,
    required: [true, 'A tour must have a duration'],
  },
  maxGroupSize: {
    type: Number,
    required: [true, 'A tour must have a group size'],
  },

  difficulty: {
    type: String,
    required: [true, 'A tour must hava a difficulty'],
  },

  priceDiscount: {
    type: Number,
  },

  summary: {
    type: String,
    trim: true,
  },

  description: {
    type: String,
    trim: true,
    required: [true, 'A tour must have a description'],
  },

  imageCover: {
    type: String,
    required: [true, 'A tour must have image Cover'],
  },

  images: [String],
  creaetdAt: {
    type: Date,
    default: Date.now(),
    select: false,
  },
  startDates: [Date],
});

const Tour = mongoose.model('Tour', tourSchema);

module.exports = Tour;
