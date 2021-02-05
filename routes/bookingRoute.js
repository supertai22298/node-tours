const express = require('express')
const { checkoutSession } = require('../controllers/bookingController')
const { verifyToken } = require('../middlewares/authMiddleware')

const router = express.Router()

router.get('/checkout-session/:tourId', verifyToken, checkoutSession)

module.exports = router
