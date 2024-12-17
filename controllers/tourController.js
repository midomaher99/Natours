const fs = require('fs');
const Tour = require(`${__dirname}/../models/tourModel`);



//control functions


module.exports.getAllTours = async (req, res) => {
    try {
        //filtering
        let queryObj = { ...req.query };
        const excludedFields = ["page", "sort", "limit", "fields"];
        excludedFields.forEach((element) => { delete queryObj[element] });
        queryObj = JSON.parse(JSON.stringify(queryObj).replace(/\b(gte|gt|lt|lte)\b/g, (match) => { return `$${match}` }));
        let query = Tour.find(queryObj);
        //sorting
        if (req.query.sort) {
            const sortBy = req.query.sort.split(',').join(" ");
            query = query.sort(sortBy);
        } else {
            query = query.sort("createdAt");
        }
        //field limiting
        if (req.query.fields) {
            const fields = req.query.fields.split(',').join(" ");
            query = query.select(fields);
        } else {
            query = query.select("-__v");
        }
        //pagination 
        const page = req.query.page * 1 || 1;
        const limit = req.query.limit * 1 || 2;
        const skip = (page - 1) * limit;
        query = query.skip(skip).limit(limit);
        const numTours = await Tour.countDocuments();
        if (skip > numTours) { throw new Error("This page does't exist."); };
        //executing query
        const tours = await query;
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