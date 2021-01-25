const User = require('../models/userModel')
const ApiFeatures = require('../utils/apiFeature')
const catchAsync = require('../utils/catchAsync')

exports.getAllUsers = catchAsync(async (req, res, next) => {
  const users = await User.find()

  return res.status(200).json({
    status: 'Success',
    result: users.length,
    data: { users },
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
