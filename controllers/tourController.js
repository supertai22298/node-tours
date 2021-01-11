const Tour = require('../models/tourModel')

exports.getAllTour = async (req, res) => {
  try {
    // Build the query
    const queryObject = { ...req.query }
    const excludedField = ['page', 'sort', 'limit', 'fields']
    excludedField.forEach((item) => delete queryObject[item])

    // advanced filtering
    let queryString = JSON.stringify(queryObject)
    queryString = queryString.replace(
      /\b(gte|gt|lte|lt)\b/g,
      (match) => `$${match}`
    )
    let query = Tour.find(JSON.parse(queryString))

    // sorting
    if (req.query.sort) {
      const sortBy = req.query.sort.split(',').join(' ')
      query = query.sort(sortBy)
    } else {
      query = query.sort('-createdAt')
    }

    // field limiting
    if (req.query.fields) {
      const fields = req.query.fields.split(',').join(' ')
      query = query.select(fields)
    } else {
      query = query.select('-__v')
    }

    // Execute query
    const tours = await query

    return res.status(200).json({
      status: 'Success',
      result: tours.length,
      data: { tours },
    })
  } catch (error) {
    return res.status(200).json({
      status: 'Failure',
      message: error,
    })
  }
}
exports.createNewTour = async (req, res) => {
  // const { name, rating, price } = req.body
  try {
    const newTour = await Tour.create(req.body)
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
