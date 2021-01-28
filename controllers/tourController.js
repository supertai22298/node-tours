const Tour = require('../models/tourModel')
const catchAsync = require('../utils/catchAsync')
const AppError = require('../utils/appError')
const {
  deleteOne,
  updateOne,
  createOne,
  getOne,
  getAll,
} = require('./handlerFactory')

exports.aliasTopTour = async (req, res, next) => {
  req.query.limit = '5'
  req.query.sort = '-ratingsAverage,price'
  req.query.fields = 'name,price,ratingsAverage,summary,difficulty'
  next()
}

// tours-within/233/center/-40,50/unit/mi
exports.getToursWithin = catchAsync(async (req, res, next) => {
  const { distance, latlng, unit } = req.params
  const [lng, lat] = latlng.split(',')

  const radius = unit === 'mi' ? distance / 3963.2 : distance / 6378.1

  if (!lat || !lng)
    return next(
      new AppError('Please provide the formal latitude and longitude', 400)
    )

  const tours = await Tour.find({
    startLocation: { $geoWithin: { $centerSphere: [[lng, lat], radius] } },
  })

  res.status(200).json({
    status: 'Success',
    result: tours.length,
    data: {
      data: tours,
    },
  })
})

exports.getAllTour = getAll(Tour)
exports.createNewTour = createOne(Tour)

exports.getTourById = getOne(Tour, { path: 'reviews' })
exports.updateTourById = updateOne(Tour)
exports.deleteTourById = deleteOne(Tour)

exports.getTourStats = catchAsync(async (req, res, next) => {
  const stats = await Tour.aggregate([
    {
      $match: {
        ratingsAverage: { $gte: 4.5 },
      },
    },
    {
      $group: {
        // _id: '$ratingsAverage',
        _id: '$difficulty',
        numberOfRating: { $sum: '$ratingsQuantity' },
        number: { $sum: 1 },
        avgRating: { $avg: '$ratingsAverage' },
        avgPrice: { $avg: '$price' },
        minPrice: { $min: '$price' },
        maxPrice: { $max: '$price' },
      },
    },
    {
      $sort: { minPrice: 1 },
    },
    {
      $match: {
        _id: { $ne: 'easy' },
      },
    },
  ])

  return res.status(200).json({
    status: 'Success',
    data: stats,
  })
})

exports.getMonthlyPlan = catchAsync(async (req, res, next) => {
  const year = +req.params.year

  const plans = await Tour.aggregate([
    {
      $unwind: '$startDates',
    },
    {
      $match: {
        startDates: {
          $gte: new Date(`${year}-01-01`),
          $lte: new Date(`${year}-12-31`),
        },
      },
    },
    {
      $group: {
        _id: { $month: '$startDates' },
        numTourStarts: { $sum: 1 },
        tours: {
          $push: '$name',
        },
      },
    },
    {
      $addFields: { month: '$_id' },
    },
    {
      $project: {
        _id: 0,
      },
    },
    {
      $sort: {
        month: 1,
      },
    },
  ])

  return res.status(200).json({
    status: 'Success',
    data: plans,
    length: plans.length,
  })
})
