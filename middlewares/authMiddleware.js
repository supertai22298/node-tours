const { promisify } = require('util')
const jwt = require('jsonwebtoken')
const AppError = require('../utils/appError')
const catchAsync = require('../utils/catchAsync')
const { verifyJwt } = require('../utils/jwt')
const User = require('../models/userModel')

exports.verifyToken = catchAsync(async (req, res, next) => {
  // Get token from request and check if it exists

  const { authorization } = req.headers

  if (!authorization || !authorization.startsWith('Bearer'))
    return next(new AppError('Invalid token', 401))

  // Verification token
  const token = authorization.split(' ')[1]
  if (!token) return next(new AppError('Invalid token', 401))

  const decoded = await verifyJwt(token)
  // Check user still exists
  const currentUser = await User.findById(decoded.id)

  if (!currentUser)
    return next(
      new AppError('The users belonging to this token is no longer exists', 401)
    )

  // Check if user changed password after token was issued
  if (currentUser.isChangedPasswordAfter(decoded.iat))
    return next(
      new AppError(
        'User recently changed the password. Please login again!',
        401
      )
    )
  // GRANT ACCESS TO PROTECTED ROUTE
  req.user = currentUser
  next()
})

exports.restrictTo = (...roles) => (req, res, next) => {
  if (!roles.includes(req.user.role)) {
    return next(
      new AppError('You do not have permissions to perform this action', 403)
    )
  }
  next()
}
