const express = require('express');
const fs = require('fs')

const app = express();
const port = 3000;

//middlewares
app.use(express.json());

//reading tours data in js object
const toursSimplePath = `${__dirname}/dev-data/data/tours-simple.json`;

const tours = JSON.parse(fs.readFileSync(toursSimplePath));

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
    fs.writeFile(toursSimplePath, JSON.stringify(tours), (err) => {
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

app.patch("/api/v1/tours/:id", (req, res) => {
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
        Object.assign(tour, req.body);
        let tourId = tours.findIndex((el) => { return el.id === tour.id });
        tours[tourId] = tour;
        fs.writeFile(toursSimplePath, JSON.stringify(tours), (err) => {
            if (err) {
                console.log(err.message)
                res
                    .status(500)
                    .send("Server Error");
            } else {
                res
                    .status(200)
                    .json({
                        status: "success",
                        data: {
                            tour
                        }
                    })
            }
        })
    }
});

app.delete("/api/v1/tours/:id", (req, res) => {
    const id = req.params.id * 1;   //convert id from string to a number
    let tourId = tours.findIndex((el) => { return el.id === id });

    if (tourId === -1) {
        res
            .status(400)
            .json({
                status: "fail",
                message: "Invalid ID"
            })
    } else {
        tours.splice(tourId, 1);
        fs.writeFile(toursSimplePath, JSON.stringify(tours), (err) => {
            if (err) {
                console.log(err.message)
                res
                    .status(500)
                    .send("Server Error");
            } else {
                res
                    .status(204)
                    .json({
                        status: "success",
                        data: null
                    })
            }
        })

    }
})

app.listen(port, () => {
    console.log(`app is running on port:${port}`)
})