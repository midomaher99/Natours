const appError = require(`${__dirname}/../utils/appError.js`);

module.exports = (err, req, res, next) => {
    //by default internal server error
    err.statusCode = err.statusCode || 500;
    res
        .status(err.statusCode)
        .json({
            status: err.status,
            message: err.message
        });
}