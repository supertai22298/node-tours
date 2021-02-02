const express = require('express')
const {
  getOverviewView,
  getTourView,
  getLoginView,
} = require('../controllers/viewsController')
const { isLoggedIn } = require('../middlewares/authMiddleware')

const router = express.Router()

router.use(isLoggedIn)

router.get('/', getOverviewView)

router.get('/login', getLoginView)

router.get('/tours/:slug', getTourView)
module.exports = router
