const express = require('express');
const userRouter = express.Router();
const userController = require('../controller/userController.js');
const authController = require('../controller/authController.js');

userRouter.post('/forgetPassword', authController.forgetPassword);
userRouter.patch('/resetPassword/:token', authController.resetPassword);
userRouter.post('/login', authController.login);
userRouter.post('/signup', authController.signup);

userRouter
  .route('/')
  .get(authController.protect, userController.getAllUsers)
  .post(userController.createNewUser);
userRouter
  .route('/:id')
  .get(userController.getUser)
  .patch(userController.updateUser);

module.exports = userRouter;
