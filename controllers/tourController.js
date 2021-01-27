const Tour = require('../models/tourModel')
const ApiFeatures = require('../utils/apiFeature')
const catchAsync = require('../utils/catchAsync')
const AppError = require('../utils/appError')

exports.aliasTopTour = async (req, res, next) => {
  req.query.limit = '5'
  req.query.sort = '-ratingsAverage,price'
  req.query.fields = 'name,price,ratingsAverage,summary,difficulty'
  next()
}

exports.getAllTour = catchAsync(async (req, res, next) => {
  // Execute query
  const features = new ApiFeatures(Tour.find(), req.query)
    .filter()
    .sort()
    .limitFields()
    .paginate()
  const tours = await features.query

  return res.status(200).json({
    status: 'Success',
    result: tours.length,
    data: { tours },
  })
})
exports.createNewTour = catchAsync(async (req, res, next) => {
  console.log('request:', req.body)
  const newTour = await Tour.create([req.body], { runValidators: true })
  return res.status(201).json({
    status: 'success',
    data: {
      tour: newTour,
    },
  })
})
exports.getTourById = catchAsync(async (req, res, next) => {
  const tour = await Tour.findById(req.params.id).populate({
    path: 'guides',
    select: '-passwordChangedAt -__v',
  })

  // TODO: Base on the requirement of programmer
  if (!tour) return next(new AppError('Cant find any tour', 404))

  return res.status(200).json({
    status: 'Success',
    data: { tour },
  })
})
exports.updateTourById = catchAsync(async (req, res, next) => {
  const tour = await Tour.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  })
  return res.status(200).json({
    status: 'Success',
    data: { tour },
  })
})
exports.deleteTourById = catchAsync(async (req, res, next) => {
  await Tour.findByIdAndDelete(req.params.id)
  return res.status(204).json({
    status: 'Success',
    data: null,
  })
})

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
