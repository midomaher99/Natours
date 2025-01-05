const fs = require('fs');
const Tour = require(`${__dirname}/../models/tourModel`);
const apiFeatures = require(`${__dirname}/../utils/apiFeatures`);
const catchAsync = require(`${__dirname}/../utils/catchAsync`);
const appError = require(`${__dirname}/../utils/appError`);
const factory = require(`${__dirname}/handlerFactory`)
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

module.exports.getTour = factory.getOne(Tour, { path: 'reviews' })


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

module.exports.updateTour = factory.updateOne(Tour);

module.exports.deleteTour = factory.deleteOne(Tour);

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

//("/tours-within/:distance/center/:latlng/unit/:unit",
module.exports.getTourWithin = catchAsync(async (req, res, next) => {
    const { distance, latlng, unit } = req.params;
    const [lat, lng] = latlng.split(',');

    if (!lat || !lng) {
        return next(new appError('Please provide a valid location, in this format lat,lng', 400));
    }
    console.log(distance, lat, lng, unit);
    const radius = unit === 'mi' ? distance / 3963.2 : distance / 6378.1;
    const tours = await Tour.find({ startLocation: { $geoWithin: { $centerSphere: [[lng, lat], radius] } } })
    res.status(200).json(
        {
            status: 'success',
            results: tours.length,
            tours
        });
});