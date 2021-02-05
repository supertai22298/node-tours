const express = require('express')
const { createBookingCheckout } = require('../controllers/bookingController')
const {
  getOverviewView,
  getTourView,
  getLoginView,
  getAccountView,
  updateUserData,
  getCheckoutSuccessView,
  getMyTourView,
} = require('../controllers/viewsController')
const {
  isLoggedIn,
  handleUnauthorized,
  verifyToken,
} = require('../middlewares/authMiddleware')

const router = express.Router()

router.use(isLoggedIn)

router.get('/', getOverviewView)
router.get('/checkout-success', createBookingCheckout, getCheckoutSuccessView)

router.get('/login', getLoginView)

router.get('/tours/:slug', getTourView)

router.get('/me', handleUnauthorized, getAccountView)

router.get('/my-tours', handleUnauthorized, verifyToken, getMyTourView)

router.post('/submit-user-data', verifyToken, updateUserData)
module.exports = router
