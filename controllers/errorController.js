const appError = require(`${__dirname}/../utils/appError`);
const server = require(`${__dirname}/../server`);

//mongo validations errors
const handleCastErrDB = (err) => {
    const message = `Invalid ${err.path}: ${err.value}.`;
    return new appError(message, 400);
}
const handleDupFieldsDB = (err, req) => {
    const message = `Tour with name '${req.body.name}' is already exist.`;
    return new appError(message, 400);
}
const handleValidationErrDB = (err) => {
    const errors = Object.values(err.errors).map(el => el.message);
    const message = `Invalid input data: ${errors.join('. ')}`;
    return new appError(message, 400);
}
const handleJWTError = () => {
    const message = "invalid token, please log in again";
    return new appError(message, 401);
}

const handleExpiredToken = () => {
    const message = "Expired token, please log in again";
    return new appError(message, 401);
}
//production and development errors
const sendErrorProd = (err, res) => {
    if (err.isOperational) {
        res
            .status(err.statusCode)
            .json({
                status: err.status,
                message: err.message
            });
    } else {//programming error
        res
            .status(500)
            .json({
                status: "error",
                message: "Something went wrong"
            });
    }
}
const sendErrorDev = (err, res) => {
    res
        .status(err.statusCode)
        .json({
            status: err.status,
            error: err,
            stack: err.stack,
            message: err.message
        });
}

//express error handler middleware
module.exports = (err, req, res, next) => {
    //by default internal server error
    err.statusCode = err.statusCode || 500;
    err.status = err.status || "error";

    if (process.env.NODE_ENV === "production") {
        let error = { ...err };
        if (err.name === 'CastError') { error = handleCastErrDB(err); }
        else if (err.code === 11000) { error = handleDupFieldsDB(err, req) }
        //else if (err.errors.name.name === "ValidatorError") { error = handleValidationErrDB(err) }
        else if (err.name === "JsonWebTokenError") { error = handleJWTError() }
        else if (err.name === "TokenExpiredError") { error = handleExpiredToken() }

        sendErrorProd(error, res);
    } else if (process.env.NODE_ENV === "development") {
        sendErrorDev(err, res);
    }

}

