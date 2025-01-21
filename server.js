const dotEnv = require("dotenv");
dotEnv.config({ path: `${__dirname}/config.env` }); //must be before requiring app to enable using the env vars in app module
const mongoose = require("mongoose");
const app = require('./app');


//connect remote DB
let DB = (process.env.NODE_ENV === 'development') ? process.env.LOCAL_DATABASE : process.env.DATABASE;

mongoose.connect(DB, { serverSelectionTimeoutMS: 5000 })
    .then(() => { console.log("DB Connected") })

//Start server
const port = process.env.PORT * 1;
const server = app.listen(port, () => {
    console.log(`app is running on port:${port}`)
});

//handle unhandled rejections
process.on('unhandledRejection', (err) => {
    // console.log(err.name, err.message);
    // console.log("Unhandled Rejection");
    server.close(() => {
        process.exit(1);
    });
});

process.on("uncaughtException", (err) => {
    // console.log(err.name, err.message);
    // console.log("Uncaught Exception");
    process.exit(1);
});

process.on('SIGTERM', () => {
    console.log('SIGTERM Received!')
    //handle current requests then close
    server.close(() => {
        console.log('Terminated')
    })
})