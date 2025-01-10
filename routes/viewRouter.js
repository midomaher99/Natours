const express = require('express');
const viewController = require(`${__dirname}/../controllers/viewController`);
const authController = require(`${__dirname}/../controllers/authController`)
const router = express.Router();

router.get('/me', authController.isLoggedIn, viewController.getAccount);

router.use(viewController.isLoggedIn);
router.get('/', viewController.getOverview);
router.get('/tour/:slug', viewController.getTour);
router.get('/login', viewController.getLoginForm);
module.exports = router;