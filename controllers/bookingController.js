const { isCurrency } = require('validator');

const stripe = require('stripe')(process.env.STRIPE_SECRETE_KEY)
const catchAsync = require(`${__dirname}/../utils/catchAsync`);
const appError = require(`${__dirname}/../utils/appError`);
const Tour = require(`${__dirname}/../models/tourModel`);
const Booking = require(`${__dirname}/../models/bookingModel`);

module.exports.getCheckoutSession = catchAsync(async (req, res, next) => {
    //get the tour from DB

    const tour = await Tour.findById(req.params.tourId);
    if (!tour) {
        return next(new appError('There is no tour with this ID', 404))
    }
    // create a checkout session 
    const session = await stripe.checkout.sessions.create({
        payment_method_types: ['card'],
        mode: 'payment',
        success_url: `${req.protocol}://${req.get('host')}/?tour=${req.params.tourId}&user=${req.user.id}&price=${tour.price}`,
        cancel_url: `${req.protocol}://${req.get('host')}/tour/${tour.slug}`,
        customer_email: req.user.email,
        client_reference_id: req.params.tourId,
        line_items: [
            {
                price_data: {
                    currency: 'usd',
                    product_data: {
                        name: `${tour.name} Tour`,
                        description: tour.summary,
                        images: [`https://natours.dev/img/tours/${tour.imageCover}`]
                    },
                    unit_amount: tour.price * 100, // Amount in cents
                },
                quantity: 1,
            }
        ]
    },
    )

    //send to the client
    res
        .status(200)
        .json({
            status: 'success',
            session
        })
});

module.exports.createBookingCheckout = catchAsync(async (req, res, next) => {
    const { tour, user, price } = req.query;
    if (!tour || !user || !price) return next();

    await Booking.create({ tour, user, price });

    res.redirect(req.originalUrl.split('?')[0]);//removing booking data from query string
})