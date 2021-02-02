const crypto = require('crypto')
const User = require('../models/userModel')
const catchAsync = require('../utils/catchAsync')
const AppError = require('../utils/appError')
const { signToken } = require('../utils/jwt')
const sendMail = require('../utils/email')

const sendJwtToken = async (statusCode, user, res) => {
  const token = await signToken({ id: user._id })
  user.password = undefined

  res.cookie('jwt', token, {
    expires: new Date(
      Date.now() + process.env.JWT_COOKIE_EXPIRES_IN * 24 * 3600 * 1000
    ),
    secure: process.env.NODE_ENV === 'production',
    httpOnly: true,
  })
  res.status(statusCode).json({
    status: 'Send token successful',
    token,
    data: { user },
  })
}

exports.signup = catchAsync(async (req, res, next) => {
  const { name, email, password, passwordConfirm } = req.body

  const newUser = await User.create({
    name,
    email,
    password,
    passwordConfirm,
  })

  await sendJwtToken(201, newUser, res)
})

exports.login = catchAsync(async (req, res, next) => {
  const { email, password } = req.body

  // check email and password existing in request's body
  if (!email || !password)
    return next(new AppError('Please provide email and password', 400))

  // check if email exists and password is correct
  const user = await User.findOne({ email }).select('+password')
  if (!user) return next(new AppError('Email is incorrect', 401))

  const correctPassword = await user.correctPassword(password, user.password)
  if (!correctPassword) return next(new AppError('Password is incorrect', 401))

  // Send new token for user
  await sendJwtToken(200, user, res)
})

exports.logout = (req, res, next) => {
  res.cookie('jwt', 'logout', {
    expires: new Date(Date.now() + 10 * 1000),
    httpOnly: true,
  })
  res.status(200).json({
    status: 'success',
  })
}

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
  )}/api/v1/users/resetPassword/${resetToken}`

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

  // Login user and send jwt based on the requirement
  await sendJwtToken(200, user, res)
})

exports.updatePassword = catchAsync(async (req, res, next) => {
  const { currentPassword, newPassword, newPasswordConfirm } = req.body

  // Get user from req.
  const user = await User.findById(req.user.id).select('+password')
  // Check the current password is correct

  if (!(await user.correctPassword(currentPassword, user.password)))
    return next(new AppError('Current password is incorrect', 400))

  // Update password based on the req.body
  user.password = newPassword
  user.passwordConfirm = newPasswordConfirm

  await user.save()
  // User.findByIdAndUpdate doesn't trigger the middleware
  // and doesn't know the this.password in middlewar

  await sendJwtToken(200, user, res)
})
