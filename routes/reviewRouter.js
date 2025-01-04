const express = require('express');
const reviewController = require(`${__dirname}/../controllers/reviewController`)
const authController = require(`${__dirname}/../controllers/authController`)
const router = express.Router({ mergeParams: true });

/**
 * routes
 * url/reviews
 * url/tours/:tourId/reviews
 */

router
    .route("/")
    .get(reviewController.getAll)
    .post(authController.isLoggedIn, authController.restrictedTo('user'), reviewController.create);

router
    .route("/:id")
    .delete(reviewController.deleteReview)
    .patch(reviewController.updateReview);

module.exports = router;