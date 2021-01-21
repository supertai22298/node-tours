const Tour = require('../models/tourModel')
const ApiFeatures = require('../utils/apiFeature')

exports.aliasTopTour = async (req, res, next) => {
  req.query.limit = '5'
  req.query.sort = '-ratingsAverage,price'
  req.query.fields = 'name,price,ratingsAverage,summary,difficulty'
  next()
}

exports.getAllTour = async (req, res) => {
  try {
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
  } catch (error) {
    return res.status(404).json({
      status: 'Failure',
      message: error,
    })
  }
}
exports.createNewTour = async (req, res) => {
  // const { name, rating, price } = req.body
  try {
    const newTour = await Tour.create(req.body, { runValidators: true })
    return res.status(201).json({
      status: 'success',
      data: {
        tour: newTour,
      },
    })
  } catch (error) {
    return res.status(500).json({
      status: 'failure',
      message: error,
    })
  }
}
exports.getTourById = async (req, res) => {
  try {
    const tour = await Tour.findById(req.params.id)
    return res.status(200).json({
      status: 'Success',
      data: { tour },
    })
  } catch (error) {
    return res.status(404).json({
      status: 'false',
      message: 'Could not find any tour',
    })
  }
}
exports.updateTourById = async (req, res) => {
  try {
    const tour = await Tour.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    })
    return res.status(200).json({
      status: 'Success',
      data: { tour },
    })
  } catch (error) {
    return res.status(500).json({
      status: 'false',
      message: error,
    })
  }
}
exports.deleteTourById = async (req, res) => {
  try {
    await Tour.findByIdAndDelete(req.params.id)
    return res.status(204).json({
      status: 'Success',
      data: null,
    })
  } catch (error) {
    return res.status(500).json({
      status: 'Failure',
      message: 'Delete tour fa',
    })
  }
}

exports.getTourStats = async (req, res) => {
  try {
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
  } catch (error) {
    return res.status(500).json({
      status: 'Failure',
      message: error.message,
    })
  }
}

exports.getMonthlyPlan = async (req, res) => {
  try {
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
  } catch (error) {
    return res.status(500).json({
      status: 'Failure',
      message: error.message,
    })
  }
}
