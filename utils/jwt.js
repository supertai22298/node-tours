const jwt = require('jsonwebtoken')

exports.signToken = async (payload) =>
  await jwt.sign(payload, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  })
exports.verifyJwt = async (token) => jwt.verify(token, process.env.JWT_SECRET)
