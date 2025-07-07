const express = require('express');
const userRouter = express.Router();
const userController = require('../controller/userController.js');
userRouter
  .route('/')
  .get(userController.getAllUsers)
  .post(userController.createNewUser);
userRouter
  .route('/:id')
  .get(userController.getUser)
  .patch(userController.updateUser);

module.exports = userRouter;
