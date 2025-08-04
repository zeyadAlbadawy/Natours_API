const express = require('express');
const router = express.Router();
const viewsController = require('../controller/viewsController.js');
const authController = require('../controller/authController.js');

router.use(authController.isLoggedIn);
router.get('/', viewsController.getOverview);
router.get('/tour/:slug', authController.protect, viewsController.getTour);

router.get('/login', viewsController.getLoginForm);
module.exports = router;
