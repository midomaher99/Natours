//IIFE to await db connections
(async () => {
    const dotEnv = require("dotenv");
    dotEnv.config({ path: `${__dirname}/config.env` }); //must be before requiring app to enable using the env vars in app module
    const mongoose = require("mongoose");
    const app = require('./app');

    //connect remote DB
    const DB = process.env.LOCAL_DATABASE;
    await mongoose.connect(DB, { serverSelectionTimeoutMS: 5000 })
        .then(() => { console.log("DB Connected") })
        .catch((err) => { console.log(err.message) });

    const tourSchema = new mongoose.Schema({
        name: {
            type: String,
            required: [true, "A tour must have a name"],
            unique: true
        },
        rating: {
            type: Number,
            default: 4.5
        },
        price: {
            type: Number,
            required: [true, "A tour must have a price"]
        }
    });

    const tour = mongoose.model("Tour", tourSchema);
    const testTour = new tour({
        name: "Wadi Degla",
        rating: 4.5
    })

    testTour.save()
        .then((doc) => { console.log(doc) })
        .catch((err) => { console.log(err.message) });

    //Start server
    const port = process.env.PORT * 1;
    app.listen(port, () => {
        console.log(`app is running on port:${port}`)
    });
})();