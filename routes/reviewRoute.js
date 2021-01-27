const express = require('express')
const {
  createReview,
  getAllReviews,
  getReviewById,
} = require('../controllers/reviewController')
const { verifyToken, restrictTo } = require('../middlewares/authMiddleware')

const router = express.Router({ mergeParams: true })

router
  .route('/')
  .post(verifyToken, restrictTo('user'), createReview)
  .get(getAllReviews)
router.route('/:reviewId').get(getReviewById)
module.exports = router
