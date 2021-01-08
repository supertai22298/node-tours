const Tour = require('../models/tourModel')

exports.getAllTour = (req, res) => {
  res.status(200).json({
    status: 'Success',
    // result: tours.length,
    // data: { tours },
  })
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
exports.getTourById = (req, res) => {
  const { tour } = req

  res.status(200).json({
    status: 'Success',
    data: { tour },
  })
}
exports.updateTourById = (req, res) => {
  const { tour } = req

  res.status(200).json({
    status: 'Success',
    data: { tour: '<Update tour here>' },
  })
}
exports.deleteTourById = (req, res) => {
  const { tour } = req

  res.status(200).json({
    status: 'Success',
    data: { tour: '<Delete tour here>' },
  })
}
exports.checkTourId = (req, res, next, value) => {
  // const tour = tours.find((item) => item.id === +value)
  // if (!tour) {
  //   return res.status(404).json({
  //     status: 'false',
  //     message: 'Could not find any tour',
  //   })
  // }
  // req.tour = tour
  next()
}
