const fs = require('fs');
const Tour = require(`${__dirname}/../models/tourModel`);
const apiFeatures = require(`${__dirname}/../utils/apiFeatures`);
const catchAsync = require(`${__dirname}/../utils/catchAsync`);
const appError = require(`${__dirname}/../utils/appError`);
//control functions
module.exports.aliasTopFiveCheapest = (req, res, next) => {
    req.query.limit = '5';
    req.query.sort = 'price,-ratingsAverage';
    req.query.fields = 'name,price,ratingsAverage,summary,difficulty';

    next();
}

module.exports.getAllTours = catchAsync(async (req, res, next) => {
    //make the query
    const features = new apiFeatures(Tour.find(), req.query);
    features
        .filter()
        .sort()
        .fieldLimiting()
        .pagination();

    //execute the query
    const tours = await features.query;

    //sending the response
    res
        .status(200)
        .json({
            status: "success",
            results: tours.length,
            data: {
                tours
            }
        });
});

module.exports.getTour = catchAsync(async (req, res, next) => {
    const tour = await Tour.findById(req.params.id);
    if (!tour) {
        next(new appError("No tour found with this ID", 404));
    } else {
        res
            .json({
                status: "success",
                data: {
                    tour
                }
            })
    }
});

module.exports.createTour = catchAsync(async (req, res, next) => {
    const newTour = await Tour.create(req.body);
    res
        .status(201)
        .json({
            status: 'success',
            data: {
                newTour
            }
        });
});

module.exports.updateTour = catchAsync(async (req, res, next) => {
    //new option to return the updated doc
    const updatedTour = await Tour.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidator: true });
    if (!tour) {
        next(new appError("No tour found with this ID", 404));
    } else {
        res
            .status(200)
            .json({
                status: 'success',
                data: {
                    updatedTour
                }
            });
    }
});

module.exports.deleteTour = catchAsync(async (req, res, next) => {
    const tour = await Tour.findByIdAndDelete(req.params.id);
    if (!tour) {
        next(new appError("No tour found with this ID", 404));
    } else {
        res
            .status(204)
            .json({});
    }
});

module.exports.getTourStats = catchAsync(async (req, res, next) => {
    const stats = await Tour.aggregate([
        {
            $match: { ratingsAverage: { $gte: 4.5 } }
        },
        {
            $group: {
                _id: "$difficulty",
                numTours: { $sum: 1 },
                numRating: { $sum: "$ratingsQuantity" },
                avgRating: { $avg: "$ratingsAverage" },
                maxPrice: { $max: "$price" },
                avgPrice: { $avg: "$price" },
                minPrice: { $min: "$price" }
            }
        },
        {
            $sort: { avgPrice: 1 }
        }
    ]);
    res
        .status(200)
        .json({
            status: 'success',
            data: {
                stats
            }
        });

});

module.exports.getMonthlyPlan = catchAsync(async (req, res, next) => {
    const year = req.params.year * 1;

    const plan = await Tour.aggregate([
        {
            $unwind: "$startDates"
        },
        {
            $match: {
                startDates: {
                    $gte: new Date(`${year}-01-01`),
                    $lte: new Date(`${year}-12-31`)
                }
            }
        },
        {
            $group: {
                _id: { $month: '$startDates' },
                numTours: { $sum: 1 },
                tours: { $push: '$name' }
            }
        },
        {
            $addFields: { 'month': '$_id' }
        },
        {
            $project: { '_id': 0 }
        },
        {
            $sort: { numTours: -1 }
        }
    ]);
    res
        .status(200)
        .json({
            status: 'success',
            data: {
                plan
            }
        });
});