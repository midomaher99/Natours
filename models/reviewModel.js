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
reviewSchema.index({ tour: 1, user: 1 }, { unique: true });//the combination of tour and user is unique

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
    if (stats.length > 0) {
        await Tour.findByIdAndUpdate(tourId, {
            ratingsAverage: stats[0].avgRatings,
            ratingsQuantity: stats[0].numRatings
        });
    } else {
        await Tour.findByIdAndUpdate(tourId, {
            ratingsAverage: 4.5,
            ratingsQuantity: 0
        })
    }
};
//calc avg and quantity for new reviews
reviewSchema.post('save', function () {
    this.constructor.calcAvgRating(this.tour)
});
//calc avg and quantity when update or delete a review
reviewSchema.pre(['findOneAndDelete', 'findOneAndReplace', 'findOneAndUpdate'], async function (next) {
    const review = await this.model.findOne(this.getQuery());
    this.rev = review;
    next()
})
reviewSchema.post(['findOneAndDelete', 'findOneAndReplace', 'findOneAndUpdate'], function (next) {
    this.rev.constructor.calcAvgRating(this.rev.tour);
})
const Review = new mongoose.model('Review', reviewSchema);
module.exports = Review;