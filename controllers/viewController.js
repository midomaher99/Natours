const Tour = require(`${__dirname}/../models/tourModel`)
const catchAsync = require(`${__dirname}/../utils/catchAsync`)
const appError = require(`${__dirname}/../utils/appError`)
const jwt = require("jsonwebtoken");
const User = require(`${__dirname}/../models/userModel`);
const Booking = require(`${__dirname}/../models/bookingModel`);

const { promisify } = require('util');
const { render } = require("../app");
const { title } = require("process");
module.exports.getOverview = catchAsync(async (req, res, next) => {
    //get tours
    const tours = await Tour.find();

    res
        .status(200)
        .render('overview', {
            title: 'All Tours',
            tours
        })
});
module.exports.getTour = catchAsync(async (req, res, next) => {
    const tour = await Tour.findOne({ slug: req.params.slug }).populate({
        path: 'reviews',
        fields: 'review rating user'
    });
    if (!tour) {
        return next(new appError('There is no tour with that name', 404))
    }
    res
        .status(200)
        .render('tour', {
            title: tour.name,
            tour
        })
});

module.exports.getLoginForm = (req, res, next) => {
    res
        .status(200)
        .render('login', {
            title: 'login'
        })
}

module.exports.isLoggedIn = async (req, res, next) => {
    try {
        //check token existence 
        let token;
        if (req.cookies.jwt) {
            token = req.cookies.jwt;
            //verify the token
            const decoded = await promisify(jwt.verify)(token, process.env.JWT_SECRET);

            // check the user existence
            const currentUser = await User.findById(decoded.id);
            if (!currentUser) {
                return next();
            }

            //check if password changed
            if (currentUser.changedPasswordAfter(decoded.iat)) {
                return next();
            }
            res.locals.user = currentUser;
            return next()
        }
        return next();
    } catch (err) {
        return next();
    }
};

module.exports.getAccount = (req, res, next) => {

    res
        .status(200)
        .render('account', {
            title: 'Your account',
            user: req.user
        })
}

module.exports.updateUserData = catchAsync(async (req, res, next) => {
    const user = await User.findByIdAndUpdate(
        req.user.id,
        {
            name: req.body.name,
            email: req.body.email
        },
        {
            new: true,
            runValidators: true
        });
    res.status(200).render('account', {
        title: 'YourAccount',
        user
    })
});

module.exports.getMyTours = catchAsync(async (req, res, next) => {
    //get booking of the user
    const bookings = await Booking.find({ user: req.user.id })
    const tourIds = bookings.map(el => el.tour)
    // const tours = tourIds.map(async id => await Tour.findById(id))
    // await Promise.all()
    const tours = await Tour.find({ _id: { $in: tourIds } });
    //render the page
    res.status(200).render('overview', {
        title: 'My Bookings',
        tours,
        user: req.user
    })
})