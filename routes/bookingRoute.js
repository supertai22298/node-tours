const express = require('express')
const {
  checkoutSession,
  getAllBooking,
  createNewBooking,
  getBookingById,
  deleteBookingById,
  updateBookingById,
} = require('../controllers/bookingController')
const { verifyToken, restrictTo } = require('../middlewares/authMiddleware')

const router = express.Router()

router.get('/checkout-session/:tourId', verifyToken, checkoutSession)

router.route('/').post(verifyToken, createNewBooking).get(getAllBooking)
router
  .route('/:id')
  .get(verifyToken, getBookingById)
  .delete(verifyToken, restrictTo('admin'), deleteBookingById)
  .patch(verifyToken, updateBookingById)
module.exports = router
