const Tour = require(`${__dirname}/../models/tourModel`)
const catchAsync = require(`${__dirname}/../utils/catchAsync`)
const appError = require(`${__dirname}/../utils/appError`)
module.exports.getOverview = catchAsync(async (req, res, next) => {
    //get tours
    const tours = await Tour.find();

    res
        .status(200)
        .render('overview', {
            title: 'All Tours',
            tours
        })
});
module.exports.getTour = catchAsync(async (req, res, next) => {
    const tour = await Tour.findOne({ slug: req.params.slug }).populate({
        path: 'reviews',
        fields: 'review rating user'
    });
    if (!tour) {
        return next(new appError('There is no tour with that name', 404))
    }
    res
        .status(200)
        .render('tour', {
            title: tour.name,
            tour
        })
});