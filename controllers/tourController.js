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