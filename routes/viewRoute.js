const express = require('express')
const {
  getOverviewView,
  getTourView,
} = require('../controllers/viewsController')

const router = express.Router()

router.get('/', getOverviewView)

router.get('/tours/:slug', getTourView)
module.exports = router
