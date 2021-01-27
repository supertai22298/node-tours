const User = require('../models/userModel')
const ApiFeatures = require('../utils/apiFeature')
const AppError = require('../utils/appError')
const catchAsync = require('../utils/catchAsync')
const { filteredObj } = require('../utils/object')
const { deleteOne, updateOne, getOne, getAll } = require('./handlerFactory')

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
exports.getMe = (req, res, next) => {
  req.params.id = req.user.id
  next()
}
exports.createUser = (req, res) => {
  res.status(500).json({
    status: 'Error',
    message: 'Please use sign up route',
  })
}
exports.getAllUsers = getAll(User)
exports.getUserById = getOne(User)
exports.updateUser = updateOne(User)
exports.deleteUser = deleteOne(User)
