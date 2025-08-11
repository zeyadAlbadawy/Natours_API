const express = require('express');
const userRouter = express.Router();
const userController = require('../controller/userController.js');
const authController = require('../controller/authController.js');

userRouter.post('/login', authController.login);
userRouter.get('/logout', authController.logout);
userRouter.post('/signup', authController.signup);

// Protect All Routes
userRouter.use(authController.protect);
userRouter.patch('/updateMyPassword', authController.updateCurrentUserPassword);
userRouter.route('/getMe').get(userController.getMe, userController.getUser);
userRouter.post('/forgetPassword', authController.forgetPassword);
userRouter.patch('/resetPassword/:token', authController.resetPassword);
userRouter.delete('/deleteMe', userController.deleteMe);
userRouter.patch(
  '/updateMe',
  userController.multerSetDestination,
  userController.updateMe,
);

userRouter.use(authController.restrictTo('admin'));
userRouter
  .route('/')
  .get(userController.getAllUsers)
  .post(userController.createNewUser);

userRouter
  .route('/:id')
  .get(userController.getUser)
  .patch(userController.updateUser)
  .delete(authController.restrictTo('admin'), userController.deleteUser);

module.exports = userRouter;
