const dotEnv = require("dotenv");
dotEnv.config({ path: `${__dirname}/config.env` }); //must be before requiring app to enable using the env vars in app module
const mongoose = require("mongoose");
const app = require('./app');

//IIFE to await DB connection
(async () => {
    //connect remote DB
    const DB = process.env.LOCAL_DATABASE;
    await mongoose.connect(DB, { serverSelectionTimeoutMS: 5000 })
        .then(() => { console.log("DB Connected") })
        .catch((err) => { console.log(err.message) });

    //Start server
    const port = process.env.PORT * 1;
    app.listen(port, () => {
        console.log(`app is running on port:${port}`)
    });
})();