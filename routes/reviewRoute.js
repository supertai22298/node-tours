const express = require('express')
const {
  createReview,
  getAllReviews,
  getReviewById,
  deleteReviewById,
  updateReviewById,
  setTourAndUserId,
} = require('../controllers/reviewController')
const { verifyToken, restrictTo } = require('../middlewares/authMiddleware')

const router = express.Router({ mergeParams: true })

router
  .route('/')
  .post(verifyToken, restrictTo('user'), setTourAndUserId, createReview)
  .get(getAllReviews)
router
  .route('/:id')
  .get(getReviewById)
  .delete(verifyToken, deleteReviewById)
  .patch(verifyToken, updateReviewById)

module.exports = router
