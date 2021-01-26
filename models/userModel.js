const mongoose = require('mongoose')
const crypto = require('crypto')
const validator = require('validator')
const bcrypt = require('bcryptjs')

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please tell us your name'],
  },
  email: {
    type: String,
    required: [true, 'Please tell us your email'],
    unique: [true, 'There is a existing duplicated email'],
    lowercase: true,
    validate: [validator.isEmail, 'Please provide a valid email'],
  },
  password: {
    type: String,
    required: [true, 'Please enter your password'],
    minlength: [6, 'The password has at least 6 characters'],
    select: false,
  },
  passwordConfirm: {
    type: String,
    required: [true, 'Please confirm your password'],
    validate: {
      // This is only works on SAVE | CREATE
      validator: function (el) {
        return this.password === el
      },
    },
    select: false,
  },
  role: {
    type: String,
    enum: ['admin', 'guide', 'lead-guide', 'user'],
    default: 'user',
  },
  photo: {
    type: String,
  },
  passwordChangedAt: {
    type: Date,
    // select: false,
  },
  passwordResetToken: String,
  passwordResetExpired: Date,
  active: {
    type: Boolean,
    default: true,
    select: false,
  },
})

userSchema.pre('save', async function (next) {
  //Only run this function if password was actually modified
  if (!this.isModified('password')) return next()

  this.password = await bcrypt.hash(this.password, 12)
  this.passwordConfirm = undefined
  next()
})

userSchema.pre('save', async function (next) {
  if (!this.isModified('password') || this.isNew) return next()
  this.passwordChangedAt = Date.now() - 1000
  next()
})

userSchema.methods.correctPassword = async function (
  plainPassword,
  currentPassword
) {
  return await bcrypt.compare(plainPassword, currentPassword)
}

userSchema.methods.isChangedPasswordAfter = function (jwtTimestamp) {
  if (!this.passwordChangedAt) return false

  const changedAt = parseInt(this.passwordChangedAt.getTime() / 1000, 10)
  return jwtTimestamp < changedAt
}

userSchema.methods.createPasswordResetToken = function () {
  const resetToken = crypto.randomBytes(32).toString('hex')
  this.passwordResetToken = crypto
    .createHash('sha256')
    .update(resetToken)
    .digest()

  console.log('resetToken: ', resetToken)
  this.passwordResetExpired = Date.now() + 10 * 60 * 1000
  return resetToken
}

userSchema.pre(/^find/, function (next) {
  this.find({
    active: { $ne: false },
  })
  next()
})
const User = mongoose.model('User', userSchema)

module.exports = User
