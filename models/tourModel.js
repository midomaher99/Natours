const mongoose = require("mongoose");
const tourSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: [true, "A tour must have a name"],
            unique: true,
            trim: true,
            maxlength: [40, "Tour name can not exceed 40 character."],
            minlength: [10, "Tour name can not be less than 10 character."]
        },
        duration: {
            type: Number,
            required: [true, "A tour must have a duration"]
        },
        maxGroupSize: {
            type: Number,
            required: [true, "A tour must have a group size"]
        },
        difficulty: {
            type: String,
            required: [true, "A tour must have a difficulty"],
            enum: {
                values: ["easy", "medium", "difficult"],
                message: "difficulty must be easy, medium or difficult"
            }
        }
        ,
        ratingsAverage: {
            type: Number,
            default: 4.5,
            min: [1, "rating must be between 1.0, 5.0"],
            max: [5, "rating must be between 1.0, 5.0"],
            set: (val) => { return (Math.round(val * 10) / 10) }
        },
        ratingsQuantity: {
            type: Number,
            default: 0
        },
        price: {
            type: Number,
            required: [true, "A tour must have a price"]
        },
        priceDiscount: {
            type: Number,
            validate: {
                validator: function (val) {
                    return val < this.price;
                },
                message: "The discount price must be blow the regular price"
            }
        },
        summary: {
            type: String,
            trim: true,
            required: [true, "A tour must have a summary"]

        },
        description: {
            type: String,
            trim: true
        },
        imageCover: {
            type: String,   //string is it will be only a reference and will be fetched from fs
            required: [true, "A tour must have a cover image"]
        },
        images: [String],
        createdAt: {
            type: Date,
            default: Date.now()
        },
        startDates: [Date],
        startLocation: {
            type: {
                type: String,
                enum: ['Point'],
                default: 'Point'
            },
            coordinates: [Number],
            address: String,
            description: String
        },
        locations: [
            {
                type: {
                    type: String,
                    enum: ['Point'],
                    default: 'Point'
                },
                coordinates: [Number],
                address: String,
                description: String,
                day: Number
            }
        ],
        guides: [
            {
                type: mongoose.Schema.ObjectId,
                ref: 'User'
            }
        ]
    },
    {
        toJSON: { virtuals: true },
        toObject: { virtuals: true }
    }
);
//define virtual property 
tourSchema.virtual("durationWeeks").get(function () {
    return this.duration / 7;
})
tourSchema.virtual("reviews", {
    ref: 'Review',
    foreignField: 'tour',
    localField: '_id'
})

//Mongoose middlewares
//document middleware runs before save command and .create
tourSchema.pre('save', function () {
    //this here referred to the document to be saved.
    //console.log(this);
})

tourSchema.pre(["find", "findOne"], function (next) {
    this.populate({ path: 'guides', select: "-passwordChangedAt -__v" });
    next();
});
const tour = mongoose.model("Tour", tourSchema);

module.exports = tour;