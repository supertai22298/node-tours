const multer = require('multer')
const User = require('../models/userModel')
const ApiFeatures = require('../utils/apiFeature')
const AppError = require('../utils/appError')
const catchAsync = require('../utils/catchAsync')
const { filteredObj } = require('../utils/object')
const { deleteOne, updateOne, getOne, getAll } = require('./handlerFactory')

const multerStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'public/img/users/')
  },
  filename: (req, file, cb) => {
    const ext = file.mimetype.split('/')[1]
    cb(null, `user-${req.user.id}-${Date.now()}.${ext}`)
  },
})
const multerFilter = (req, file, cb) => {
  if (file.mimetype.startsWith('image')) cb(null, true)
  else cb(new AppError('Not an image! Please upload only image', 400), false)
}

const upload = multer({ storage: multerStorage, fileFilter: multerFilter })

exports.uploadUserPhoto = upload.single('photo')

exports.updateMe = catchAsync(async (req, res, next) => {
  console.log(req.file)
  console.log(req.body)
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
    user,
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
