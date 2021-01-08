const Tour = require('../models/tourModel')

exports.getAllTour = async (req, res) => {
  try {
    const tours = await Tour.find()
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
exports.deleteTourById = (req, res) => {
  const { tour } = req

  res.status(200).json({
    status: 'Success',
    data: { tour: '<Delete tour here>' },
  })
}
