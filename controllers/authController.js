const { promisify } = require('util');
const jwt = require("jsonwebtoken");
const User = require(`${__dirname}/../models/userModel`);
const catchAsync = require(`${__dirname}/../utils/catchAsync`);
const appError = require(`${__dirname}/../utils/appError`);

const signToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRES_IN });
}

//Creating new user
module.exports.signup = catchAsync(async (req, res, next) => {
    const newUser = await User.create({
        name: req.body.name,
        password: req.body.password,
        email: req.body.email,
        passwordConfirm: req.body.passwordConfirm
    });

    const token = signToken(newUser._id)
    newUser.password = undefined;
    res.status(201).
        json({
            status: "success",
            token,
            data: {
                newUser
            }
        })
});

module.exports.signin = catchAsync(async (req, res, next) => {
    const { email, password } = req.body;
    if (!email || !password) {
        return next(new appError('Please provide email and password', 400));
    }
    //checking email
    const user = await User.findOne({ email }).select({ email: 1, password: 1 });
    if (!user) {
        return next(new appError('Incorrect e-mail or password.', 401));
    }
    //checking password
    const correct = await user.isCorrectPassword(password, user.password);
    if (!correct) {
        return next(new appError('Incorrect e-mail or password.', 401));
    }
    //generate token
    const token = signToken(user._id)

    //send response
    res.status(200).
        json({
            status: "success",
            token
        })

});

module.exports.isLoggedIn = catchAsync(async (req, res, next) => {

    //check token existence 
    let token;
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        token = req.headers.authorization.split(' ')[1];
    }
    if (!token) {
        return next(new appError('You are not logged in', 401));
    }
    //verify the token
    const decoded = await promisify(jwt.verify)(token, process.env.JWT_SECRET);

    // check the user existence
    const currentUser = await User.findById(decoded.id);
    if (!currentUser) {
        return next(new appError('The user belongs to this token does no longer exist.', 401));
    }

    //check if password changed
    if (currentUser.changedPasswordAfter(decoded.iat)) {
        return next(new appError('Password changed! Please login again.', 401));
    }
    req.user = currentUser;
    next();
});