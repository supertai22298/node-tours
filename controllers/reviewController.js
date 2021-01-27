const Review = require('../models/reviewModel')
const catchAsync = require('../utils/catchAsync')

exports.getAllReviews = catchAsync(async (req, res, next) => {
  const reviews = await Review.find()
  res.status(200).json({
    status: 'Success',
    results: reviews.length,
    data: {
      reviews,
    },
  })
})
exports.getReviewById = catchAsync(async (req, res, next) => {
  const review = await Review.findById(req.params.id)
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
  const review = await Review.create([req.body], { runValidator: true })
  res.status(201).json({
    status: 'Success',
    data: {
      review,
    },
  })
})
