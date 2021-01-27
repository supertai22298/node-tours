const express = require('express')
const {
  createReview,
  getAllReviews,
  getReviewById,
} = require('../controllers/reviewController')
const { verifyToken, restrictTo } = require('../middlewares/authMiddleware')

const router = express.Router()

router
  .route('/')
  .post(verifyToken, restrictTo('user'), createReview)
  .get(getAllReviews)
router.route('/:id').get(getReviewById)
module.exports = router
