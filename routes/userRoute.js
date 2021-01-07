const express = require('express')

const getAllUsers = (req, res) => {
  res.status(500).json({
    status: 'Error',
    message: 'Not implement',
  })
}
const createUser = (req, res) => {
  res.status(500).json({
    status: 'Error',
    message: 'Not implement',
  })
}
const getUserById = (req, res) => {
  res.status(500).json({
    status: 'Error',
    message: 'Not implement',
  })
}
const updateUser = (req, res) => {
  res.status(500).json({
    status: 'Error',
    message: 'Not implement',
  })
}
const deleteUser = (req, res) => {
  res.status(500).json({
    status: 'Error',
    message: 'Not implement',
  })
}

const userRouter = express.Router()
userRouter.route('/').get(getAllUsers).post(createUser)
userRouter.route('/:id').get(getUserById).patch(updateUser).delete(deleteUser)

module.exports = userRouter
