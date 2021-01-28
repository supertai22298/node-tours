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
  getMonthlyPlan,
  getToursWithin,
} = require('../controllers/tourController')
const { verifyToken, restrictTo } = require('../middlewares/authMiddleware')
const reviewRouter = require('./reviewRoute')

router.use('/:tourId/reviews', reviewRouter)

router.route('/top-5-cheap').get(aliasTopTour, getAllTour)
router.route('/tours-stat').get(getTourStats)
router.route('/monthly-plan/:year').get(getMonthlyPlan)

router
  .route('/tours-within/:distance/center/:latlng/unit/:unit')
  .get(getToursWithin)

router.use(verifyToken)

router.route('/').get(getAllTour)
router.route('/:id').get(getTourById)

router.use(restrictTo('admin'))

router.route('/').post(createNewTour)
router.route('/:id').patch(updateTourById).delete(deleteTourById)

module.exports = router
