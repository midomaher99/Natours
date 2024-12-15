const fs = require('fs');

//reading tours data in js object
const toursSimplePath = `${__dirname}/../dev-data/data/tours-simple.json`;
const tours = JSON.parse(fs.readFileSync(toursSimplePath));

//control functions

module.exports.checkID = (req, res, next, val) => {
    const tourIndex = tours.findIndex((el) => { return el.id === val * 1 }); //*1 to convert from string into number
    if (tourIndex === -1) {
        res
            .status(400)
            .json({
                status: "fail",
                message: "Invalid ID"
            })
    } else {
        req.id = tourIndex;
        next();
    }
};

module.exports.checkBody = (req, res, next) => {
    if (req.body.name == null || req.body.price == null) {
        res
            .status(400)
            .json({
                status: "fail",
                message: "Invalid Tour data"
            })
    } else {
        next();
    }
}


module.exports.getAllTours = (req, res) => {
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

module.exports.getTour = (req, res) => {
    const id = req.params.id * 1;   //convert id from string to a number
    res
        .json({
            status: "success",
            data: {
                tour: JSON.stringify(tours[req.id])
            }
        })

};

module.exports.createTour = (req, res) => {
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

module.exports.updateTour = (req, res) => {
    const tour = tours[req.id];

    Object.assign(tour, req.body);
    tours[req.id] = tour;
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
};

module.exports.deleteTour = (req, res) => {
    tours.splice(req.id, 1);
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
};