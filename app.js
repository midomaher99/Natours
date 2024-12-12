const express = require('express');
const fs = require('fs')

const app = express();
const port = 3000;

//middlewares
app.use(express.json());

//reading tours data in js object
const tours = JSON.parse(fs.readFileSync(`${__dirname}/dev-data/data/tours-simple.json`));

//Routes handlers
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
});

app.get("/api/v1/tours/:id", (req, res) => {
    const id = req.params.id * 1;   //convert id from string to a number

    const tour = tours.find((el) => { return el.id === id })

    if (tour === undefined) {
        res
            .status(400)
            .json({
                status: "fail",
                message: "Invalid ID"
            })
    } else {
        res
            .json({
                status: "success",
                data: {
                    tour
                }
            })
    }
});

app.post("/api/v1/tours", (req, res) => {
    const newId = tours[tours.length - 1].id + 1;
    const newTour = Object.assign({ id: newId }, req.body);
    tours.push(newTour);
    fs.writeFile(`${__dirname}/dev-data/data/tours-simple.json`, JSON.stringify(tours), (err) => {
        if (err) {
            res
                .status(500)
                .send("Server Error");
        } else {
            res
                .status(201)
                .json({
                    status: 'success',
                    data: {
                        newTour
                    }
                });
        }
    })
});



app.listen(port, () => {
    console.log(`app is running on port:${port}`)
})