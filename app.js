//import modules
const path = require('path')
const express = require('express');
const morgan = require('morgan');
const rateLimit = require('express-rate-limit');
const helmet = require('helmet');
const mongoSanitizer = require('express-mongo-sanitize');
const xss = require('xss-clean');
const hpp = require('hpp');
const { title } = require('process');
const cookieParser = require('cookie-parser');
const globalErrorhandler = require(`${__dirname}/controllers/errorController`);
const appError = require(`${__dirname}/utils/appError`);

//import routers
const tourRouter = require(`${__dirname}/routes/tourRoutes`);
const userRouter = require(`${__dirname}/routes/userRoutes`);
const reviewRouter = require(`${__dirname}/routes/reviewRouter`);
const viewRouter = require(`${__dirname}/routes/viewRouter`);
//init
const app = express();

app.set('view engine', 'pug');
app.set('views', path.join(__dirname, 'views'));
//global middlewares
app.use(express.static(path.join(__dirname, 'public')));

app.use(helmet());

if (process.env.NODE_ENV === "development") {
    app.use(morgan("dev"));    // logging middleware
}

const limiter = rateLimit({
    max: 100,
    windowMs: 60 * 60 * 1000,
    message: "Too many request from this IP, please try again in an hour"
})
app.use('/api', limiter);

app.use(mongoSanitizer());
app.use(xss());
app.use(hpp({
    whitelist: ['duration']
}))
app.use(express.json({ limit: '10kb' }));    // body parser
app.use(cookieParser());

app.use(
    helmet.contentSecurityPolicy({
        directives: {
            defaultSrc: ["'self'"],
            scriptSrc: ["'self'", "https://cdn.jsdelivr.net"],
        },
    })
);

//Routers mounting
app.use('/', viewRouter);
app.use("/api/v1/tours", tourRouter);
app.use("/api/v1/users", userRouter);
app.use("/api/v1/reviews", reviewRouter)

//unhandled routes
app.all('*', (req, res, next) => {
    next(new appError(`Can't find ${req.originalUrl}`, 404));
});
//error handler
app.use(globalErrorhandler);
module.exports = app;