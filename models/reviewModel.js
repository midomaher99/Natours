const mongoose = require("mongoose");
const reviewSchema = new mongoose.Schema(
    {
        rating: {
            type: Number,
            min: [0.0, "Rating can not be less than zero"],
            max: [5.0, "Rating can not be more than five"],
            required: [true, 'Review must have a rating']
        },
        createdAt: {
            type: Date,
            default: Date.now()
        },
        review: {
            type: String,
            required: [true, "Review can not be empty"]
        },
        tour: {
            type: mongoose.Schema.ObjectId,
            ref: 'Tour',
            required: [true, "Review must be relevant to a tour"]
        },
        user: {
            type: mongoose.Schema.ObjectId,
            ref: 'User',
            required: [true, 'Review must belong to a user']
        }
    },
    {
        toObject: { virtuals: true },
        toJSON: { virtuals: true }
    }
)

const Review = new mongoose.model('Review', reviewSchema);
module.exports = Review;