const express = require('express');
const reviewController = require(`${__dirname}/../controllers/reviewController`)
const authController = require(`${__dirname}/../controllers/authController`)
const router = express.Router({ mergeParams: true });

/**
 * routes
 * url/reviews
 * url/tours/:tourId/reviews
 */

router.use(authController.isLoggedIn);

router
    .route("/")
    .get(reviewController.getAll)
    .post(reviewController.create);

router
    .route("/:id")
    .delete(authController.restrictedTo('user', 'admin'), reviewController.deleteReview)
    .patch(authController.restrictedTo('user', 'admin'), reviewController.updateReview);

module.exports = router;