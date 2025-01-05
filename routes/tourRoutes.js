const express = require("express");
const tourController = require(`${__dirname}/../controllers/tourController`);
const authController = require(`${__dirname}/../controllers/authController`);
const reviewRouter = require(`${__dirname}/reviewRouter`);
const router = express.Router();


//routes handler
router.use('/:tourId/reviews', reviewRouter);

router
    .route("/stats")
    .get(authController.isLoggedIn, authController.restrictedTo('admin', 'lead-guide'), tourController.getTourStats);
router
    .route("/monthly-plan/:year")
    .get(authController.isLoggedIn, authController.restrictedTo('admin', 'lead-guide'), tourController.getMonthlyPlan)
router
    .route("/top-5-cheapest")
    .get(tourController.aliasTopFiveCheapest, tourController.getAllTours);

router
    .route("/tours-within/:distance/center/:latlng/unit/:unit").get(tourController.getTourWithin)

router
    .route("/")
    .get(tourController.getAllTours)
    .post(authController.isLoggedIn, authController.restrictedTo('admin', 'lead-guide'), tourController.createTour);

router
    .route("/:id")
    .get(tourController.getTour)
    .patch(authController.isLoggedIn, authController.restrictedTo('admin', 'lead-guide'), tourController.updateTour)
    .delete(authController.isLoggedIn, authController.restrictedTo('admin', 'lead-guide'), tourController.deleteTour);

module.exports = router;