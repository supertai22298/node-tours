const Review = require('../models/reviewModel')
const catchAsync = require('../utils/catchAsync')

exports.getAllReviews = catchAsync(async (req, res, next) => {
  let filter = {}
  const { tourId } = req.params
  if (tourId) filter = { ...filter, tour: tourId }

  const reviews = await Review.find(filter)
  res.status(200).json({
    status: 'Success',
    results: reviews.length,
    data: {
      reviews,
    },
  })
})
exports.getReviewById = catchAsync(async (req, res, next) => {
  const review = await Review.findById(req.params.reviewId)
    .populate({
      path: 'tour',
      select: 'name',
    })
    .populate({
      path: 'user',
      select: 'name photo',
    })
  res.status(200).json({
    status: 'Success',
    data: {
      review,
    },
  })
})

exports.createReview = catchAsync(async (req, res, next) => {
  if (!req.body.user) req.body.user = req.user.id
  if (!req.body.tour) req.body.tour = req.params.tourId

  const review = await Review.create([req.body], { runValidator: true })
  res.status(201).json({
    status: 'Success',
    data: {
      review,
    },
  })
})
