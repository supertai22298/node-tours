const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY)
const catchAsync = require('../utils/catchAsync')
const Tour = require('../models/tourModel')
const Booking = require('../models/bookingModel')
const AppError = require('../utils/appError')

exports.checkoutSession = catchAsync(async (req, res, next) => {
  // 1. Get currently booked tour

  const tour = await Tour.findById(req.params.tourId)

  // 2. Create checkouut session
  const session = await stripe.checkout.sessions.create({
    payment_method_types: ['card'],
    mode: 'payment',
    success_url: `${req.protocol}://${req.get('host')}/checkout-success?tour=${
      tour.id
    }&user=${req.user.id}&price=${tour.price}`,
    cancel_url: `${req.protocol}://${req.get('host')}/tours/${tour.slug}`,
    customer_email: req.user.email,
    client_reference_id: req.params.tourId,
    line_items: [
      {
        name: `${tour.name} Tour`,
        description: tour.summary,
        images: [
          `${req.protocol}://${req.get('host')}/img/tours/${tour.imageCover}`,
        ],
        amount: tour.price * 100,
        currency: 'usd',
        quantity: 1,
      },
    ],
  })
  // 3. Create session response
  res.status(200).json({
    status: 'success',
    session,
  })
})

exports.createBookingCheckout = catchAsync(async (req, res, next) => {
  const { tour, user, price } = req.query
  if (!tour && !user && !price)
    return next(new AppError('Something went wrong', 400))
  const booking = await Booking.create({
    tour,
    user,
    price,
  })
  if (!booking) return next(new AppError('Something went wrong', 500))
  next()
})
