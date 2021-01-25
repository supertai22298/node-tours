const jwt = require('jsonwebtoken')
const bcrypt = require('bcryptjs')
const User = require('../models/userModel')
const catchAsync = require('../utils/catchAsync')
const AppError = require('../utils/appError')

const signToken = async (payload) =>
  await jwt.sign(payload, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  })

exports.signup = catchAsync(async (req, res, next) => {
  const { name, email, password, passwordConfirm } = req.body

  const newUser = await User.create({
    name,
    email,
    password,
    passwordConfirm,
  })

  const token = await signToken({ id: newUser._id })

  res.status(201).json({
    status: 'Success',
    token,
    data: {
      user: newUser,
    },
  })
})

exports.login = catchAsync(async (req, res, next) => {
  const { email, password } = req.body

  // check email and password existing

  if (!email || !password)
    return next(new AppError('Please provide email and password', 400))

  // check if email exists and password is correct
  const user = await User.findOne({ email }).select('+password')
  if (!user) return next(new AppError('Email is incorrect', 401))

  const correctPassword = await user.correctPassword(password)
  if (!correctPassword) return next(new AppError('Password is incorrect', 401))

  // Send new token for user
  const token = await signToken({ id: user._id })

  res.status(200).json({
    status: 'Success',
    token,
  })
})
