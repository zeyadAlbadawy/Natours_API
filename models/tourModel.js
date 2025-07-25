const mongoose = require('mongoose');
const slugify = require('slugify');
const validator = require('validator');
const User = require('./userModel');

const tourSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'A tour must have a name'],
      unique: true,
      trim: true,
      minLength: [10, 'A tour name must be greater than 10 characters!'],
      maxLength: [40, 'A tour name must not exceed 40 charachters'],
      // validate: {
      //   validator: validator.isAlpha,
      //   message: 'The Name must be a string!',
      // },
    },
    ratingsAverage: {
      type: Number,
      default: 4.5,
      min: [1, 'Rating must be above 1.0'],
      max: [5, 'Rating must be bellow 5.0'],
      set: (val) => Math.round(val * 10) / 10,
      // The Set funciton will be run whenever there will be a new value
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
      enum: {
        values: ['easy', 'difficult', 'medium'],
        message: 'The Difficulty must be easy, medium, difficult only!',
      },
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
    creatdAt: {
      type: Date,
      default: Date.now,
      select: false,
    },
    slug: String,
    startDates: [Date],
    secretTour: {
      type: Boolean,
      default: false,
    },
    priceDiscount: {
      type: Number,
      validate: {
        validator: function (val) {
          return val < this.price;
        },
        message: 'Price discount ({VALUE}) should be less than the price',
      },
    },
    // Embeded Document for tours locations
    startLocation: {
      // The Type And Coordinates used to specify this as GEO
      type: {
        type: String,
        default: 'Point',
        enum: ['Point'],
      },
      coordinates: {
        type: [Number],
        required: true,
      },
      address: String,
      description: String,
    },
    locations: [
      {
        type: {
          type: String,
          default: 'Point',
          enum: ['Point'],
        },
        coordinates: {
          type: [Number],
          required: true,
        },
        address: String,
        description: String,
        day: Number,
      },
    ],
    // guides Using Embdeding will be just by making it of type Array And using middleware we will get the
    // users associated withthis middleware and save it to the tour
    // guides: {type: Array} then use this.guides.map() and map the res of getting tour.find in the guides
    // // if i choose embeding the users inside the tour this middleware to convert guides ids to valid users
    // tourSchema.pre('save', async function (next) {
    //   const tourGuidesPromises = this.guides.map(
    //     async (id) => await User.findById(id),
    //   );
    //   this.guides = await Promise.all(tourGuidesPromises);
    //   next();
    // });

    // Another
    // This implements the ***(Child Referencing)*** which is the parent(Tours) references the Users(ids) array
    // this can be done using pagination .populate

    guides: [
      {
        type: mongoose.Schema.ObjectId,
        ref: 'User',
      },
    ],
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  },
);

tourSchema.virtual('durationWeeks').get(function () {
  return this.duration / 7;
});

// This implements so that the tour has access to all reviews avaiable for this tour (Child Referencing)
// so this will be an array which holds a reference to all reviews! after that use populate to complete this
// Actions based upon find or whatever

tourSchema.virtual('reviews', {
  ref: 'Review',
  foreignField: 'tour',
  localField: '_id',
});

// Pre document middleware runs on .save() and on .create() only
tourSchema.pre('save', function (next) {
  this.slug = slugify(this.name, { lower: true });
  next();
});

// tourSchema.pre(/^find/, function (next) {
//   this.find({ secretTour: { $ne: true } });
//   next();
// });

tourSchema.index({ price: 1, ratingsAverage: -1 });
tourSchema.index({ slug: 1 });
tourSchema.index({ startLocation: '2dsphere' });
// Applies The Child Referencing will will not be saved into the data-base like embeding
tourSchema.pre(/^find/, function (next) {
  this.populate({
    path: 'guides',
    select: '-__v -passwordChangedAt',
  });
  next();
});

// tourSchema.pre('aggregate', function (next) {
//   this.pipeline().unshift({ $match: { secretTour: { $ne: true } } });
//   console.log(this.pipeline());
//   next();
// });

// tourSchema.post('save', function (doc, next) {
//   console.log(doc);
//   next();
// });

// post for query middle ware has access to all docs not only the current doc as save
const Tour = mongoose.model('Tour', tourSchema);

module.exports = Tour;
