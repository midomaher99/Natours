//import modules
const express = require('express');
const morgan = require('morgan');
const globalErrorhandler = require(`${__dirname}/controllers/errorController`);
const appError = require(`${__dirname}/utils/appError`);

//import routers
const tourRouter = require("./routes/tourRoutes");
const userRouter = require("./routes/userRoutes");

//init
const app = express();

//global middlewares
if (process.env.NODE_ENV === "development") {
    app.use(morgan("dev"));    // logging middleware
}
app.use(express.static(`${__dirname}/public`))
app.use(express.json());    // body parser

//Routers mounting

app.use("/api/v1/tours", tourRouter);
app.use("/api/v1/users", userRouter);
//unhandled routes
app.all('*', (req, res, next) => {
    next(new appError(`Can't find ${req.originalUrl}`, 404));
});

app.use(globalErrorhandler);
module.exports = app;