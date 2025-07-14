const dotenv = require('dotenv');
const mongoose = require('mongoose');
dotenv.config({ path: './config.env' });

// UnCaught Exception Error
// process.on('uncaughtException', () => {
//   console.log('uncaught Exception');
//   process.exit(1);
// });

const app = require('./app.js');

const DB = process.env.DATABASE.replace(
  '<db_password>',
  process.env.DATABASE_PASSWORD,
);

mongoose.connect(DB).then(() => console.log('DB Connected Successfully!'));

const server = app.listen(process.env.PORT, () => {
  console.log(`App is Running on Port ${process.env.PORT}`);
});

// Unhandled Rejection From Promises
process.on('unhandledRejection', () => {
  console.log('unhandeled rejection');
  server.close(() => process.exit(1));
});
