const dotenv = require('dotenv');
const mongoose = require('mongoose');
const Tour = require('../../models/tourModel.js');
const fs = require('fs');
dotenv.config({ path: './config.env' });
const tours = JSON.parse(
  fs.readFileSync(`${__dirname}/tours-simple.json`, 'utf-8'),
);

const DB = process.env.DATABASE.replace(
  '<db_password>',
  process.env.DATABASE_PASSWORD,
);

mongoose
  .connect(DB, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log('DB Connected Successfully!'));

const importData = async () => {
  try {
    await Tour.create(tours);
    console.log('Data Loaded Succesfully');
  } catch (err) {
    console.log(err);
  }
  process.exit();
};

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
