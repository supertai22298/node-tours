const { promisify } = require('util')
const jwt = require('jsonwebtoken')
const AppError = require('../utils/appError')
const catchAsync = require('../utils/catchAsync')
const { verifyJwt } = require('../utils/jwt')
const User = require('../models/userModel')

exports.verifyToken = catchAsync(async (req, res, next) => {
  // Get token from request and check if it exists

  const { authorization } = req.headers
  let token
  if (authorization && authorization.startsWith('Bearer')) {
    token = authorization.split(' ')[1]
  } else if (req.cookies.jwt) {
    token = req.cookies.jwt
  }
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

// Only for rendered page
exports.isLoggedIn = catchAsync(async (req, res, next) => {
  if (req.cookies.jwt) {
    const decoded = await verifyJwt(req.cookies.jwt)

    const currentUser = await User.findById(decoded.id)
    if (!currentUser) return next()

    if (currentUser.isChangedPasswordAfter(decoded.iat)) return next()

    res.locals.user = currentUser
    return next()
  }
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
