const express = require('express')
const {
  getOverviewView,
  getTourView,
  getLoginView,
  getAccountView,
  updateUserData,
} = require('../controllers/viewsController')
const {
  isLoggedIn,
  handleUnauthorized,
  verifyToken,
} = require('../middlewares/authMiddleware')

const router = express.Router()

router.use(isLoggedIn)

router.get('/', getOverviewView)

router.get('/login', getLoginView)

router.get('/tours/:slug', getTourView)

router.get('/me', handleUnauthorized, getAccountView)

router.post('/submit-user-data', verifyToken, updateUserData)
module.exports = router
