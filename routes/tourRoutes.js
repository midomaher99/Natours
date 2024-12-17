const express = require("express");
const tourController = require("../controllers/tourController");
const router = express.Router();



//routes handler
router
    .route("/top-5-cheapest")
    .get(tourController.aliasTopFiveCheapest, tourController.getAllTours);

router
    .route("/")
    .get(tourController.getAllTours)
    .post(tourController.createTour);

router
    .route("/:id")
    .get(tourController.getTour)
    .patch(tourController.updateTour)
    .delete(tourController.deleteTour);

module.exports = router;