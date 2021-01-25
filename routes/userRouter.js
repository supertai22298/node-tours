const express = require('express')
const { signup, login } = require('../controllers/authController')

const {
  getAllUsers,
  createUser,
  getUserById,
  updateUser,
  deleteUser,
} = require('../controllers/userController')
const { verifyToken, restrictTo } = require('../middlewares/authMiddleware')

const router = express.Router()

router.post('/signup', signup).post('/login', login)
router.use(verifyToken).route('/').get(getAllUsers).post(createUser)
router
  .use(verifyToken)
  .route('/:id')
  .get(getUserById)
  .patch(updateUser)
  .delete(restrictTo('admin', 'lead-guide'), deleteUser)

module.exports = router
