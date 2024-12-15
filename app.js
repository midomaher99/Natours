//import modules
const express = require('express');
const fs = require('fs');
const morgan = require('morgan');

//init
const app = express();
const port = 3000;

//middlewares
app.use(morgan("combined"))
app.use(express.json());
app.use((req, res, next) => {
    req.requestTime = new Date().toISOString();
    next();
})
//reading tours data in js object
const toursSimplePath = `${__dirname}/dev-data/data/tours-simple.json`;
const tours = JSON.parse(fs.readFileSync(toursSimplePath));

//Routes callbacks (tours resource)
const getAllTours = (req, res) => {
    res
        .status(200)
        .json({
            status: "success",
            results: tours.length,
            data: {
                tours
            }
        });
};

const getTour = (req, res) => {
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
};

const createTour = (req, res) => {
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
};

const updateTour = (req, res) => {
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
};

const deleteTour = (req, res) => {
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
                    .json({
                        status: "fail",
                        message: "server error"
                    });
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
};

//Routes Callbacks (user resource)
const getAllUsers = (req, res) => {
    res
        .status(500)
        .json({
            status: "fail",
            message: "The route is not yet defined"
        });
};

const createUser = (req, res) => {
    res
        .status(500)
        .json({
            status: "fail",
            message: "The route is not yet defined"
        });
};

const deleteUser = (req, res) => {
    res
        .status(500)
        .json({
            status: "fail",
            message: "The route is not yet defined"
        });
};

const updateUser = (req, res) => {
    res
        .status(500)
        .json({
            status: "fail",
            message: "The route is not yet defined"
        });
};

const getUser = (req, res) => {
    res
        .status(500)
        .json({
            status: "fail",
            message: "The route is not yet defined"
        });
};


//Routes handlers

//tours resource

const tourRouter = express.Router();

tourRouter
    .route("/")
    .get(getAllTours)
    .post(createTour);

tourRouter
    .route("/:id")
    .get(getTour)
    .patch(updateTour)
    .delete(deleteTour);


app.use("/api/v1/tours", tourRouter);

//user resource

const userRouter = express.Router();

userRouter
    .route("/")
    .get(getAllUsers)
    .post(createUser);

userRouter
    .route("/:id")
    .get(getUser)
    .patch(updateUser)
    .delete(deleteUser);

app.use("/api/v1/users", userRouter);

//Start server
app.listen(port, () => {
    console.log(`app is running on port:${port}`)
});