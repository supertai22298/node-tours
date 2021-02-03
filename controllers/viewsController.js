const Tour = require('../models/tourModel')
const User = require('../models/userModel')
const catchAsync = require('../utils/catchAsync')

exports.getOverviewView = catchAsync(async (req, res, next) => {
  const tours = await Tour.find()

  res.status(200).render('overview', {
    title: 'Overview tours',
    tours,
  })
})
exports.getTourView = catchAsync(async (req, res, next) => {
  const tour = await Tour.findOne({ slug: req.params.slug }).populate({
    path: 'reviews',
    select: '+review +rating +user',
  })

  res.status(200).render('tour', {
    title: tour.name,
    tour,
  })
})

exports.getLoginView = (req, res, next) => {
  if (!res.locals.user)
    res.status(200).render('login', {
      title: 'Login into your account',
    })

  res.redirect('/')
}

exports.getAccountView = (req, res, next) => {
  res.status(200).render('account', {
    title: 'Profile',
  })
}

exports.updateUserData = catchAsync(async (req, res, next) => {
  const { email, name } = req.body
  const user = await User.findByIdAndUpdate(
    req.user.id,
    { email, name },
    { runValidators: true, new: true }
  )
  res.status(200).render('account', {
    title: 'Profile',
    user,
  })
})
