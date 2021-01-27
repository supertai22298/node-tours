const Review = require('../models/reviewModel')
const catchAsync = require('../utils/catchAsync')
const {
  deleteOne,
  updateOne,
  createOne,
  getOne,
  getAll,
} = require('./handlerFactory')

exports.setTourAndUserId = catchAsync(async (req, res, next) => {
  if (!req.body.user) req.body.user = req.user.id
  if (!req.body.tour) req.body.tour = req.params.tourId
  next()
})
exports.getAllReviews = getAll(Review)
exports.getReviewById = getOne(Review, {
  path: 'tour',
  select: 'name',
})

exports.createReview = createOne(Review)
exports.deleteReviewById = deleteOne(Review)
exports.updateReviewById = updateOne(Review)
