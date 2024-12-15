//import modules
const express = require('express');
const morgan = require('morgan');

//import routers
const tourRouter = require("./routes/tourRoutes");
const userRouter = require("./routes/userRoutes");

//init
const app = express();

//global middlewares
app.use(morgan("dev"));    // logging middleware
app.use(express.static(`${__dirname}/public`))
app.use(express.json());    // body parser

app.use((req, res, next) => { // test own middleware
    req.requestTime = new Date().toISOString();
    next();
})

//Routers mounting

app.use("/api/v1/tours", tourRouter);
app.use("/api/v1/users", userRouter);

module.exports = app;