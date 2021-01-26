const express = require('express')
const {
  signup,
  login,
  forgotPassword,
  resetPassword,
  updatePassword,
} = require('../controllers/authController')

const {
  getAllUsers,
  createUser,
  getUserById,
  updateUser,
  deleteUser,
  updateMe,
  deleteMe,
} = require('../controllers/userController')
const { verifyToken, restrictTo } = require('../middlewares/authMiddleware')

const router = express.Router()

router.post('/signup', signup).post('/login', login)
router
  .post('/forgot-password', forgotPassword)
  .patch('/reset-password/:resetToken', resetPassword)
  .patch('/update-password', verifyToken, updatePassword)
  .patch('/update-me', verifyToken, updateMe)
  .delete('/delete-me', verifyToken, deleteMe)

router.use(verifyToken).route('/').get(getAllUsers).post(createUser)

router
  .use(verifyToken)
  .route('/:id')
  .get(getUserById)
  .patch(updateUser)
  .delete(restrictTo('admin', 'lead-guide'), deleteUser)

module.exports = router
