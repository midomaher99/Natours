const appError = require(`${__dirname}/../utils/appError`)
const User = require(`${__dirname}/../models/userModel`)
const catchAsync = require(`${__dirname}/../utils/catchAsync`)
const filterObj = (obj, ...allowedFields) => {
    const newObj = {};
    Object.keys(obj).forEach(el => {
        if (allowedFields.includes(el)) { newObj[el] = obj[el] };
    });
    return newObj;
}

//Routes Callbacks (user resource)
module.exports.getAllUsers = catchAsync(async (req, res, next) => {
    const users = await User.find();
    res
        .status(200)
        .json({
            status: "success",
            results: users.length,
            data: { users }
        });
});

module.exports.createUser = (req, res) => {
    res
        .status(500)
        .json({
            status: "fail",
            message: "The route is not yet defined"
        });
};

module.exports.deleteUser = (req, res) => {
    res
        .status(500)
        .json({
            status: "fail",
            message: "The route is not yet defined"
        });
};

module.exports.updateUser = (req, res) => {
    res
        .status(500)
        .json({
            status: "fail",
            message: "The route is not yet defined"
        });
};

module.exports.getUser = (req, res) => {
    res
        .status(500)
        .json({
            status: "fail",
            message: "The route is not yet defined"
        });
};

exports.updateMe = catchAsync(async (req, res, next) => {
    if (req.body.password || req.body.passwordConfirm) {
        return next(new appError("This route is not for updating password!", 400));
    }
    const filteredObj = filterObj(req.body, 'name', 'email');
    const updatedUser = await User.findByIdAndUpdate(req.user.id, filteredObj, { new: true, runValidators: true });
    res
        .status(200)
        .json({
            status: "success",
            user: updatedUser
        })
});

exports.deleteMe = catchAsync(async (req, res, next) => {
    const updatedUser = await User.findByIdAndUpdate(req.user.id, { active: false });
    res
        .status(204)
        .json({
            status: "success"
        })
});