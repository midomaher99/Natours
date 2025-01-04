const Review = require(`${__dirname}/../models/reviewModel`);
const catchAsync = require(`${__dirname}/../utils/catchAsync`);
const factory = require(`${__dirname}/handlerFactory`);


module.exports.getAll = catchAsync(async (req, res, next) => {
    //handle nested routes
    let filter = (req.params.tourId) ? { tour: req.params.tourId } : {};

    const reviews = await Review.find(filter);
    res
        .status(200)
        .json(
            {
                status: "success",
                results: reviews.length,
                reviews
            }
        )
});
module.exports.create = catchAsync(async (req, res, next) => {
    if (!req.body.tour) { req.body.tour = req.params.tourId };
    if (!req.body.user) { req.body.user = req.user.id };

    const newReview = await Review.create(req.body);
    res
        .status(201)
        .json(
            {
                status: "success",
                review: newReview
            }
        )
});

module.exports.deleteReview = factory.deleteOne(Review);
module.exports.updateReview = factory.updateOne(Review);
