const express = require('express')
const tourRouter = express.Router()
const {
  getAllTour,
  createNewTour,
  getTourById,
  updateTourById,
  deleteTourById,
} = require('../controllers/tourController')

tourRouter.route('/').get(getAllTour).post(createNewTour)
tourRouter
  .route('/:id')
  .get(getTourById)
  .patch(updateTourById)
  .delete(deleteTourById)

module.exports = tourRouter
