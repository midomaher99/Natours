const express = require('express');
const viewController = require(`${__dirname}/../controllers/viewController`);
const router = express.Router();

router.use(viewController.isLoggedIn);

router.get('/', viewController.getOverview);
router.get('/tour/:slug', viewController.getTour);
router.get('/login', viewController.getLoginForm);
module.exports = router;