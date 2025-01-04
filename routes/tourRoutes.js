const express = require("express");
const tourController = require(`${__dirname}/../controllers/tourController`);
const authController = require(`${__dirname}/../controllers/authController`);
const reviewRouter = require(`${__dirname}/reviewRouter`);
const router = express.Router();


//routes handler
router.use('/:tourId/reviews', reviewRouter);

router
    .route("/stats")
    .get(tourController.getTourStats);
router
    .route("/monthly-plan/:year")
    .get(tourController.getMonthlyPlan)
router
    .route("/top-5-cheapest")
    .get(tourController.aliasTopFiveCheapest, tourController.getAllTours);

router
    .route("/")
    .get(authController.isLoggedIn, tourController.getAllTours)
    .post(tourController.createTour);

router
    .route("/:id")
    .get(tourController.getTour)
    .patch(tourController.updateTour)
    .delete(authController.isLoggedIn, authController.restrictedTo('admin', 'lead-guide'), tourController.deleteTour);

module.exports = router;