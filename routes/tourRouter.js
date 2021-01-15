const express = require('express')

const router = express.Router()
const {
  getAllTour,
  createNewTour,
  getTourById,
  updateTourById,
  deleteTourById,
  aliasTopTour,
  getTourStats,
  // checkTourId,
} = require('../controllers/tourController')

/*
//param middleware
router.param('id', checkTourId)
exports.checkTourId = async (req, res, next, value) => {
  try {
    const tour = await Tour.findById(req.params.id)
    if (!tour) {
      return res.status(404).json({
        status: 'false',
        message: 'Could not find any tour',
      })
    }
    req.tour = tour
    next()
  } catch (error) {
    return res.status(500).json({
      status: 'failure',
      message: error,
    })
  }
}
*/
router.route('/top-5-cheap').get(aliasTopTour, getAllTour)

router.route('/tours-stat').get(getTourStats)

router.route('/').get(getAllTour).post(createNewTour)
router
  .route('/:id')
  .get(getTourById)
  .patch(updateTourById)
  .delete(deleteTourById)

module.exports = router
