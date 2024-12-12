const express = require('express');
const fs = require('fs')

const app = express();
const port = 3000;

//reading tours data in js object
const tours = JSON.parse(fs.readFileSync(`${__dirname}/dev-data/data/tours-simple.json`));

app.get("/api/v1/tours", (req, res) => {
    res
        .status(200)
        .json({
            status: "success",
            results: tours.length,
            data: {
                tours
            }
        });
})

app.post("/", (req, res) => {
    res
        .status(200)
        .send("you can post to this endpoint..")
})


app.listen(port, () => {
    console.log(`app is running on port:${port}`)
})