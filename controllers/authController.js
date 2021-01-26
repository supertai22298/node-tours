const crypto = require('crypto')
const User = require('../models/userModel')
const catchAsync = require('../utils/catchAsync')
const AppError = require('../utils/appError')
const { signToken } = require('../utils/jwt')
const sendMail = require('../utils/email')

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

  // check email and password existing in request's body
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

exports.forgotPassword = catchAsync(async (req, res, next) => {
  // 1. Get user based on email
  const { email } = req.body
  const user = await User.findOne({ email })
  if (!user) {
    return next(new AppError('There is no user with this email', 400))
  }

  // 2. Generate random reset token
  const resetToken = user.createPasswordResetToken()
  await user.save({ validateBeforeSave: false })

  // 3. Send the link via email with resetToken
  const resetUrl = `${req.protocol}://${req.get(
    'host'
  )}/api/users/resetPassword/${resetToken}`

  try {
    // Can remove 'await' if don't want catch the error or result
    await sendMail({
      to: user.email,
      subject: 'Forgot your password? (Valid in 10 minutes)',
      message: `Submit a request with your new password and confirm new password to ${resetUrl}`,
    })
  } catch (error) {
    user.resetPassword = undefined
    user.passwordResetExpired = undefined
    await user.save({ validateBeforeSave: false })
    return next(new AppError('Something went wrong. Please try again!', 500))
  }

  res.status(200).json({
    status: 'Success',
    message: 'Token sent to email',
  })
})

exports.resetPassword = catchAsync(async (req, res, next) => {
  const { resetToken } = req.params
  const { password, passwordConfirm } = req.body
  const hashedToken = crypto.createHash('sha256').update(resetToken).digest()

  // Get user based on resetToken
  const user = await User.findOne({
    passwordResetToken: hashedToken,
    passwordResetExpired: { $gte: Date.now() },
  })
  // If token has not expired and user is found, set new password
  if (!user) return next(new AppError('Token is invalid or has expired', 400))
  user.password = password
  user.passwordConfirm = passwordConfirm

  //set null for reset token
  user.passwordResetToken = undefined
  user.passwordResetExpired = undefined
  //  Update the passwordChangedAt via mongoose document middleware

  await user.save()

  res.status(200).json({
    status: 'Success',
    message: 'Change password successful',
  })
})
