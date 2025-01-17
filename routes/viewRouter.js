const express = require('express');
const viewController = require(`${__dirname}/../controllers/viewController`);
const authController = require(`${__dirname}/../controllers/authController`)
const bookingController = require(`${__dirname}/../controllers/bookingController`)
const router = express.Router();

router.get('/me', authController.isLoggedIn, viewController.getAccount);
router.post('/submit-user-data', authController.isLoggedIn, viewController.updateUserData);

router.use(viewController.isLoggedIn);
router.get('/', bookingController.createBookingCheckout, viewController.getOverview);
router.get('/tour/:slug', viewController.getTour);
router.get('/login', viewController.getLoginForm);

module.exports = router;