const dotenv = require('dotenv');
const mongoose = require('mongoose');
const Tour = require('../../models/tourModel.js');
const fs = require('fs');
dotenv.config({ path: './config.env' });
const tours = JSON.parse(fs.readFileSync(`${__dirname}/tours.json`, 'utf-8'));

const DB = process.env.DATABASE.replace(
  '<db_password>',
  process.env.DATABASE_PASSWORD,
);

mongoose.connect(DB).then(() => console.log('DB Connected Successfully!'));

const importData = async () => {
  try {
    // Process each tour to ensure proper data format
    const processedTours = tours.map((tour) => {
      // Ensure coordinates are properly formatted
      if (tour.startLocation && tour.startLocation.coordinates) {
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

    await Tour.create(processedTours);
    console.log('Data Loaded Successfully');
  } catch (err) {
    console.log(err);
  }
  process.exit();
};
// const importData = async () => {
//   try {
//     await Tour.create(tours);
//     console.log('Data Loaded Succesfully');
//   } catch (err) {
//     console.log(err);
//   }
//   process.exit();
// };

const deleteDB = async () => {
  try {
    await Tour.deleteMany();
    console.log('DB Deleted Successfully');
  } catch (err) {
    console.log(err);
  }
  process.exit();
};

if (process.argv[2] === '--import') importData();
else if (process.argv[2] === '--delete') deleteDB();
