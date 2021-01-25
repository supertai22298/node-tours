const mongoose = require('mongoose')
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
  photo: {
    type: String,
  },
  passwordChangedAt: {
    type: Date,
    // select: false,
  },
})

userSchema.pre('save', async function (next) {
  //Only run this function if password was actually modified
  if (!this.isModified('password')) return next()

  this.password = await bcrypt.hash(this.password, 12)
  this.passwordConfirm = undefined
  next()
})

userSchema.methods.correctPassword = async function (plainPassword) {
  return await bcrypt.compare(plainPassword, this.password)
}

userSchema.methods.isChangedPasswordAfter = function (jwtTimestamp) {
  if (!this.passwordChangedAt) return false

  const changedAt = parseInt(this.passwordChangedAt.getTime() / 1000, 10)
  return jwtTimestamp < changedAt
}

const User = mongoose.model('User', userSchema)

module.exports = User
