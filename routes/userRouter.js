const express = require('express')
const { signup, login } = require('../controllers/authController')

const {
  getAllUsers,
  createUser,
  getUserById,
  updateUser,
  deleteUser,
} = require('../controllers/userController')

const router = express.Router()

router.post('/signup', signup).post('/login', login)
router.route('/').get(getAllUsers).post(createUser)
router.route('/:id').get(getUserById).patch(updateUser).delete(deleteUser)

module.exports = router
