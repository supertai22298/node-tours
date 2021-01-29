const Tour = require('../models/tourModel')
const catchAsync = require('../utils/catchAsync')

exports.getOverviewView = catchAsync(async (req, res, next) => {
  const tours = await Tour.find()
  res.status(200).render('overview', {
    title: 'Overview tours',
    tours,
  })
})
exports.getTourView = catchAsync(async (req, res, next) => {
  const tour = await Tour.findOne({ slug: req.params.slug }).populate({
    path: 'reviews',
    select: '+review +rating +user',
  })

  res.status(200).render('tour', {
    title: tour.name,
    tour,
  })
})
