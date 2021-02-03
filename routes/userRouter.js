const express = require('express')
const {
  signup,
  login,
  forgotPassword,
  resetPassword,
  updatePassword,
  logout,
} = require('../controllers/authController')

const {
  getAllUsers,
  createUser,
  getUserById,
  updateUser,
  deleteUser,
  updateMe,
  deleteMe,
  getMe,
  uploadUserPhoto,
  resizeUserPhoto,
} = require('../controllers/userController')
const { verifyToken, restrictTo } = require('../middlewares/authMiddleware')

const router = express.Router()

// Route with no auth
router
  .post('/signup', signup)
  .post('/login', login)
  .get('/logout', logout)
  .post('/forgot-password', forgotPassword)
  .patch('/reset-password/:resetToken', resetPassword)

// Routes with auth
router.use(verifyToken)
router
  .patch('/update-password', updatePassword)
  .patch('/update-me', uploadUserPhoto, resizeUserPhoto, updateMe)
  .delete('/delete-me', deleteMe)
  .get('/get-me', getMe, getUserById)

// Routes just for admin
router.use(restrictTo('admin'))
router.route('/').get(getAllUsers).post(createUser)
router.route('/:id').get(getUserById).patch(updateUser).delete(deleteUser)

module.exports = router
