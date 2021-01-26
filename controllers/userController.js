const User = require('../models/userModel')
const ApiFeatures = require('../utils/apiFeature')
const AppError = require('../utils/appError')
const catchAsync = require('../utils/catchAsync')
const { filteredObj } = require('../utils/object')

exports.getAllUsers = catchAsync(async (req, res, next) => {
  const users = await User.find()

  return res.status(200).json({
    status: 'Success',
    result: users.length,
    data: { users },
  })
})

exports.updateMe = catchAsync(async (req, res, next) => {
  // 1. Create error if user post password data
  const { password, passwordConfirm } = req.body
  if (password || passwordConfirm)
    return next(new AppError('This route is not for password update', 400))

  // 2. Update user document
  const filteredFields = filteredObj(req.body, 'name', 'email')
  const user = await User.findByIdAndUpdate(req.user.id, filteredFields, {
    new: true,
    runValidators: true,
  })
  user.save()
  res.status(200).json({
    status: 'Update successful',
  })
})
exports.deleteMe = catchAsync(async (req, res, next) => {
  const user = await User.findByIdAndUpdate(
    req.user.id,
    {
      active: false,
    },
    {
      new: true,
      runValidators: true,
    }
  )
  user.save()
  res.status(204).json({
    status: 'Successful',
  })
})

exports.createUser = (req, res) => {
  res.status(500).json({
    status: 'Error',
    message: 'Not implement',
  })
}
exports.getUserById = (req, res) => {
  res.status(500).json({
    status: 'Error',
    message: 'Not implement',
  })
}
exports.updateUser = (req, res) => {
  res.status(500).json({
    status: 'Error',
    message: 'Not implement',
  })
}
exports.deleteUser = (req, res) => {
  res.status(500).json({
    status: 'Error',
    message: 'Not implement',
  })
}
