const dotenv = require('dotenv');
const mongoose = require('mongoose');
dotenv.config({ path: './config.env' });
const app = require('./app.js');

const DB = process.env.DATABASE.replace(
  '<db_password>',
  process.env.DATABASE_PASSWORD,
);

mongoose.connect(DB).then(() => console.log('DB Connected Successfully!'));

app.listen(process.env.PORT, () => {
  console.log(`App is Running on Port ${process.env.PORT}`);
});
