const catchAsync = require(`${__dirname}/../utils/catchAsync`)
const appError = require(`${__dirname}/../utils/appError`)
module.exports.deleteOne = (Model) => {

    const deleteDoc = catchAsync(async (req, res, next) => {
        const deletedDoc = await Model.findByIdAndDelete(req.params.id);
        if (!deletedDoc) {
            next(new appError("No document found with this ID", 404));
        } else {
            res
                .status(204)
                .json({});
        }
    });

    return deleteDoc;
}



module.exports.updateOne = (Model) => {

    const updateDoc = catchAsync(async (req, res, next) => {
        //new option to return the updated doc
        const updatedDoc = await Model.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidator: true });
        if (!updatedDoc) {
            next(new appError("No document found with this ID", 404));
        } else {
            res
                .status(200)
                .json({
                    status: 'success',
                    data: {
                        updatedDoc
                    }
                });
        }
    });

    return updateDoc;
}

module.exports.getOne = (Model, populateOptions) => {

    const getDoc = catchAsync(async (req, res, next) => {
        const query = Model.findById(req.params.id);
        if (populateOptions) query.populate(populateOptions);
        doc = await query;
        if (!doc) {
            next(new appError("No document found with this ID", 404));
        } else {
            res
                .json({
                    status: "success",
                    data: {
                        doc
                    }
                })
        }
    });

    return getDoc;
}