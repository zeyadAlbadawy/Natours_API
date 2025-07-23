const dotenv = require('dotenv');
const mongoose = require('mongoose');
const fs = require('fs');

// Models
const Tour = require('../../models/tourModel.js');
const User = require('../../models/userModel.js');
const Review = require('../../models/reviewModel.js');

// Load environment variables
dotenv.config({ path: './config.env' });

const DB = process.env.DATABASE.replace(
  '<db_password>',
  process.env.DATABASE_PASSWORD,
);

// Connect to DB
mongoose.connect(DB).then(() => console.log('✅ DB Connected Successfully'));

// Read JSON files
const tours = JSON.parse(fs.readFileSync(`${__dirname}/tours.json`, 'utf-8'));
const users = JSON.parse(fs.readFileSync(`${__dirname}/users.json`, 'utf-8'));
const reviews = JSON.parse(
  fs.readFileSync(`${__dirname}/reviews.json`, 'utf-8'),
);

// Import data into DB
const importData = async () => {
  try {
    // Process each tour to ensure coordinates are numbers
    const processedTours = tours.map((tour) => {
      if (tour.startLocation?.coordinates) {
        tour.startLocation.coordinates =
          tour.startLocation.coordinates.map(Number);
      }
      if (tour.locations) {
        tour.locations = tour.locations.map((loc) => {
          if (loc.coordinates) {
            loc.coordinates = loc.coordinates.map(Number);
          }
          return loc;
        });
      }
      return tour;
    });

    // Insert all models
    await Tour.create(processedTours);
    await User.create(users, { validateBeforeSave: false }); // skip password hash issues
    await Review.create(reviews);

    console.log(' Data Loaded Successfully!');
  } catch (err) {
    console.error(' Error importing data:', err);
  }
  process.exit();
};

// Delete all data from DB
const deleteDB = async () => {
  try {
    await Tour.deleteMany();
    await User.deleteMany();
    await Review.deleteMany();

    console.log('🗑️ DB Data Deleted Successfully!');
  } catch (err) {
    console.error('❌ Error deleting data:', err);
  }
  process.exit();
};

// Run with command-line args
if (process.argv[2] === '--import') importData();
else if (process.argv[2] === '--delete') deleteDB();
