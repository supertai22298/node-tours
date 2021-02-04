const multer = require('multer')
const sharp = require('sharp')
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

const multerStorage = multer.memoryStorage()

const multerFilter = (req, file, cb) => {
  if (file.mimetype.startsWith('image')) cb(null, true)
  else cb(new AppError('Not an image! Please upload only image', 400), false)
}

const upload = multer({ storage: multerStorage, fileFilter: multerFilter })

exports.uploadTourImages = upload.fields([
  { name: 'imageCover', maxCount: 1 },
  { name: 'images', maxCount: 3 },
])

exports.resizeTourImages = catchAsync(async (req, res, next) => {
  if (!req.files.imageCover || !req.files.images) return next()

  //Image covers
  const imageCoverFilename = `tour-${req.params.id}-${Date.now()}-cover.jpeg`
  await sharp(req.files.imageCover[0].buffer)
    .resize(2000, 1333)
    .toFormat('jpeg')
    .jpeg({ quality: 90 })
    .toFile(`public/img/tours/${imageCoverFilename}`)
  req.body.imageCover = imageCoverFilename

  //Images
  req.body.images = []
  await Promise.all(
    req.files.images.map(async (file, index) => {
      const filename = `tour-${req.params.id}-${Date.now()}-${index + 1}.jpeg`
      await sharp(file.buffer)
        .resize(2000, 1333)
        .toFormat('jpeg')
        .jpeg({ quality: 90 })
        .toFile(`public/img/tours/${filename}`)
      req.body.images.push(filename)
    })
  )

  next()
})

// tours-within/233/center/-40,50/unit/mi
exports.getToursWithin = catchAsync(async (req, res, next) => {
  const { distance, lnglat, unit } = req.params
  const [lng, lat] = lnglat.split(',')

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

// /distances/:lnglat/unit/:unit
exports.getDistances = catchAsync(async (req, res, next) => {
  const { lnglat, unit } = req.params
  const [lng, lat] = lnglat.split(',')

  if (!lat || !lng)
    return next(
      new AppError('Please provide the formal latitude and longitude', 400)
    )

  const distances = await Tour.aggregate([
    {
      $geoNear: {
        near: { type: 'Point', coordinates: [+lng, +lat] },
        distanceField: 'distance',
        distanceMultiplier: 0.001,
      },
    },
    {
      $project: {
        distance: 1,
        name: 1,
      },
    },
    {
      $sort: {
        distance: 1,
      },
    },
  ])

  res.status(200).json({
    status: 'Success',
    data: {
      data: distances,
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
