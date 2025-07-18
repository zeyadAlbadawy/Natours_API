const express = require('express');
const userRouter = express.Router();
const userController = require('../controller/userController.js');
const authController = require('../controller/authController.js');

userRouter.delete('/deleteMe', authController.protect, userController.deleteMe);
userRouter.patch('/updateMe', authController.protect, userController.updateMe);
userRouter.patch(
  '/updateMyPassword',
  authController.protect,
  authController.updateCurrentUserPassword,
);
userRouter.post('/forgetPassword', authController.forgetPassword);
userRouter.patch('/resetPassword/:token', authController.resetPassword);
userRouter.post('/login', authController.login);
userRouter.post('/signup', authController.signup);

userRouter
  .route('/')
  .get(userController.getAllUsers)
  .post(userController.createNewUser);
userRouter
  .route('/:id')
  .get(userController.getUser)
  .patch(userController.updateUser)
  .delete(
    authController.protect,
    authController.restrictTo('admin'),
    userController.deleteUser,
  );

module.exports = userRouter;
