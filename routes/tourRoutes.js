const express = require("express");
const tourController = require("../controllers/tourController");
const authController = require(`${__dirname}/../controllers/authController`);
const router = express.Router();


//routes handler
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
    .delete(tourController.deleteTour);

module.exports = router;