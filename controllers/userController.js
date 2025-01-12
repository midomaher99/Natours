const multer = require('multer');
const sharp = require('sharp');
const appError = require(`${__dirname}/../utils/appError`);
const User = require(`${__dirname}/../models/userModel`);
const catchAsync = require(`${__dirname}/../utils/catchAsync`);
const factory = require(`${__dirname}/handlerFactory`);


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

const filterObj = (obj, ...allowedFields) => {
    const newObj = {};
    Object.keys(obj).forEach(el => {
        if (allowedFields.includes(el)) { newObj[el] = obj[el] };
    });
    return newObj;
}

//Routes Callbacks (user resource)
module.exports.uploadUserPhoto = upload.single('photo');

module.exports.resizeUserPhoto = (req, res, next) => {
    if (!req.file) return next();
    req.file.filename = `user-${req.user.id}-${Date.now()}.jpeg`;
    sharp(req.file.buffer)
        .resize(500, 500)
        .toFormat('jpeg')
        .jpeg({ quality: 90 })
        .toFile(`public/img/users/${req.file.filename}`);
    next();
}
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

module.exports.deleteUser = factory.deleteOne(User);
module.exports.updateUser = factory.updateOne(User);
module.exports.getUser = factory.getOne(User);

module.exports.getMe = (req, res, next) => {
    req.params.id = req.user.id;
    next();
}

exports.updateMe = catchAsync(async (req, res, next) => {
    if (req.body.password || req.body.passwordConfirm) {
        return next(new appError("This route is not for updating password!", 400));
    }
    const filteredObj = filterObj(req.body, 'name', 'email');
    if (req.file) { filteredObj.photo = req.file.filename }
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