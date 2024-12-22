const fs = require('fs');
const Tour = require(`${__dirname}/../models/tourModel`);
const apiFeatures = require(`${__dirname}/../utils/apiFeatures`);


//control functions
module.exports.aliasTopFiveCheapest = (req, res, next) => {
    req.query.limit = '5';
    req.query.sort = 'price,-ratingsAverage';
    req.query.fields = 'name,price,ratingsAverage,summary,difficulty';

    next();
}

module.exports.getAllTours = async (req, res) => {
    try {
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
    } catch (err) {
        res
            .status(500)
            .json({
                status: 'fail',
                message: err.message
            });
    }
};

module.exports.getTour = async (req, res) => {
    try {
        const tour = await Tour.findById(req.params.id);
        res
            .json({
                status: "success",
                data: {
                    tour
                }
            })
    } catch (err) {
        res
            .status(400)
            .json({
                status: 'fail',
                message: err.message
            });
    }
};

module.exports.createTour = async (req, res) => {

    try {
        const newTour = await Tour.create(req.body);
        res
            .status(201)
            .json({
                status: 'success',
                data: {
                    newTour
                }
            });
    } catch (err) {
        res
            .status(400)
            .json({
                status: 'fail',
                message: err.message
            });
    }
};

module.exports.updateTour = async (req, res) => {
    try {
        //new option to return the updated doc
        const updatedTour = await Tour.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidator: true });
        res
            .status(200)
            .json({
                status: 'success',
                data: {
                    updatedTour
                }
            });
    } catch (err) {
        res
            .status(400)
            .json({
                status: 'fail',
                message: err.message
            });
    }
};

module.exports.deleteTour = async (req, res) => {
    try {
        await Tour.findByIdAndDelete(req.params.id);
        res
            .status(204)
            .json({});
    } catch (err) {
        res
            .status(400)
            .json({
                status: 'fail',
                message: err.message
            });
    }
};

module.exports.getTourStats = async (req, res) => {
    try {
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
    } catch (err) {
        res
            .status(400)
            .json({
                status: 'fail',
                message: err.message
            });
    }
}

module.exports.getMonthlyPlan = async (req, res) => {
    try {
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
    } catch (err) {
        res
            .status(400)
            .json({
                status: 'fail',
                message: err.message
            });
    }
}