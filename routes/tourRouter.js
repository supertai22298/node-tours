const express = require('express')
const router = express.Router()
const {
  getAllTour,
  createNewTour,
  getTourById,
  updateTourById,
  deleteTourById,
  checkTourId,
  checkCreateTourRequest,
} = require('../controllers/tourController')

// param middleware
router.param('id', checkTourId)

router.route('/').get(getAllTour).post(checkCreateTourRequest, createNewTour)
router
  .route('/:id')
  .get(getTourById)
  .patch(updateTourById)
  .delete(deleteTourById)

module.exports = router
