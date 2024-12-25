const crypto = require('crypto');
const { promisify } = require('util');
const jwt = require("jsonwebtoken");
const sendEmail = require(`${__dirname}/../utils/email`);
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
        passwordConfirm: req.body.passwordConfirm,
        role: req.body.role
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

module.exports.restrictedTo = (...roles) => {
    return (req, res, next) => {
        if (!roles.includes(req.user.role)) {
            return next(new appError("You do not have permission to perform this action", 403))
        }
        next();
    }
}

module.exports.forgotPassword = catchAsync(async (req, res, next) => {
    //get user from email
    const user = await User.findOne({ email: req.body.email });
    if (!user) {
        return next(new appError("User not found", 404));
    }
    //generate token
    const token = user.createPasswordResetToken();
    await user.save({ validateBeforeSave: false });
    //send email
    const resetUrl = `${req.protocol}://${req.get('host')}/api/v1/users/reset-password/${token}`;
    const message = `forgot you password? submit a Patch request with your new password to: ${resetUrl}\nIf you didn't forgot your password ignore this mail.`
    try {
        await sendEmail({
            email: user.email,
            subject: "Password reset token, valid for only 10 min.",
            message
        })
        res.status(200).json({
            status: 'success',
            message: "token sent to the mail"
        })
    } catch (err) {
        user.passwordResetToken = undefined;
        user.passwordResetTokenExpire = undefined;
        await user.save({ validateBeforeSave: false });
        return next(new appError('Error in sending the reset email, please try again later.', 500));

    }
});
module.exports.resetPassword = catchAsync(async (req, res, next) => {
    //get user from its token
    const hashedToken = crypto.createHash('sha256').update(req.params.token).digest('hex');
    const user = await User.findOne({ passwordResetToken: hashedToken, passwordResetTokenExpire: { $gt: Date.now() } });
    //valid token and user exists then set new password
    if (!user) {
        return next(new appError("Invalid token!", 400))
    }
    user.password = req.body.password;
    user.passwordConfirm = req.body.passwordConfirm;
    //update changePasswordAt
    user.passwordResetToken = undefined;
    user.passwordResetTokenExpire = undefined;
    await user.save();
    //send new JWT (login)
    const token = signToken(user._id)

    //send response
    res.status(200).
        json({
            status: "success",
            token
        })
})