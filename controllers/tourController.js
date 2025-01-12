const fs = require('fs');
const multer = require('multer');
const sharp = require('sharp');
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

const multerStorage = multer.memoryStorage();
const multerFilter = (req, file, cb) => {
    if (file.mimetype.startsWith('image')) {
        cb(null, true);
    } else {
        cb(new appError('Not an image!', 400), false);
    }
}
const upload = multer({
    storage: multerStorage,
    fileFilter: multerFilter
});
module.exports.uploadTourImages = upload.fields([
    { name: "imageCover", maxCount: 1 },
    { name: "images", maxCount: 3 }
]);

module.exports.resizeTourImages = catchAsync(async (req, res, next) => {
    if (!req.files.imageCover || !req.files.images) return next();
    //processing image cover
    req.body.imageCover = `tour-${req.params.id}-${Date.now()}-cover.jpeg`;
    await sharp(req.files.imageCover[0].buffer)
        .resize(2000, 1333)
        .toFormat('jpeg')
        .jpeg({ quality: 90 })
        .toFile(`public/img/tours/${req.body.imageCover}`);
    //processing tour images
    req.body.images = new Array()
    for (i in req.files.images) {
        req.body.images.push(`tour-${req.params.id}-${Date.now()}-${i * 1 + 1}.jpeg`);
        await sharp(req.files.images[i].buffer)
            .resize(2000, 1333)
            .toFormat('jpeg')
            .jpeg({ quality: 90 })
            .toFile(`public/img/tours/${req.body.images[i]}`);
    }
    next();
})
