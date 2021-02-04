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
  getDistances,
  uploadTourImages,
  resizeTourImages,
} = require('../controllers/tourController')
const { verifyToken, restrictTo } = require('../middlewares/authMiddleware')
const reviewRouter = require('./reviewRoute')

router.use('/:tourId/reviews', reviewRouter)

router.route('/top-5-cheap').get(aliasTopTour, getAllTour)
router.route('/tours-stat').get(getTourStats)
router.route('/monthly-plan/:year').get(getMonthlyPlan)

router
  .route('/tours-within/:distance/center/:lnglat/unit/:unit')
  .get(getToursWithin)

router.route('/distances/:lnglat/unit/:unit').get(getDistances)

router.route('/').get(getAllTour)
router.route('/:id').get(getTourById)

router.use(verifyToken)
router.use(restrictTo('admin'))

router.route('/').post(createNewTour)
router
  .route('/:id')
  .patch(uploadTourImages, resizeTourImages, updateTourById)
  .delete(deleteTourById)

module.exports = router
