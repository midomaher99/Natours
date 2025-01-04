const mongoose = require("mongoose");
const Tour = require(`${__dirname}/tourModel`)

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
reviewSchema.index({ tour: 1 });

reviewSchema.pre(['find', 'findOne'], function (next) {
    this.populate({ path: 'user', select: 'name' });
    next();
})
//define static method to calc avg rating and update the tour
reviewSchema.statics.calcAvgRating = async function (tourId) {
    const stats = await this.aggregate([
        {
            $match: { tour: tourId }
        },
        {
            $group: {
                _id: '$tour',
                numRatings: { $sum: 1 },
                avgRatings: { $avg: '$rating' }
            }
        }
    ]);
    await Tour.findByIdAndUpdate(tourId, {
        ratingsAverage: stats[0].avgRatings,
        ratingsQuantity: stats[0].numRatings
    });
};

reviewSchema.post('save', function () {
    this.constructor.calcAvgRating(this.tour)
});
const Review = new mongoose.model('Review', reviewSchema);
module.exports = Review;