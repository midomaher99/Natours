//import modules
const path = require('path');
const express = require('express');
const morgan = require('morgan');
const rateLimit = require('express-rate-limit');
const helmet = require('helmet');
const mongoSanitizer = require('express-mongo-sanitize');
const xss = require('xss-clean');
const hpp = require('hpp');
const { title } = require('process');
const cookieParser = require('cookie-parser');
const compression = require('compression');
const cors = require('cors');
const globalErrorhandler = require(`${__dirname}/controllers/errorController`);
const appError = require(`${__dirname}/utils/appError`);

//import routers
const tourRouter = require(`${__dirname}/routes/tourRoutes`);
const userRouter = require(`${__dirname}/routes/userRoutes`);
const reviewRouter = require(`${__dirname}/routes/reviewRouter`);
const viewRouter = require(`${__dirname}/routes/viewRouter`);
const bookingRouter = require(`${__dirname}/routes/bookingRouter`);
//init
const app = express();

//Server-Side rendering using pug
app.set('view engine', 'pug');
app.set('views', path.join(__dirname, 'views'));

//implementing CORS
app.use(cors());
app.options('*', cors());

//global middlewares
app.use(express.static(path.join(__dirname, 'public')));
app.use(compression())
// app.use(helmet());

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
app.use(express.urlencoded({ extended: true, limit: '10kb' }))



//Routers mounting
app.use('/', viewRouter);
app.use("/api/v1/tours", tourRouter);
app.use("/api/v1/users", userRouter);
app.use("/api/v1/reviews", reviewRouter)
app.use("/api/v1/booking", bookingRouter)

//unhandled routes
app.all('*', (req, res, next) => {
    next(new appError(`Can't find ${req.originalUrl}`, 404));
});
//error handler
app.use(globalErrorhandler);
module.exports = app;