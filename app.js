const express = require('express')
const morgan = require('morgan')
const rateLimit = require('express-rate-limit')
const helmet = require('helmet')
const xss = require('xss-clean')
const hpp = require('hpp')
const mongoSanitize = require('express-mongo-sanitize')
const path = require('path')
const cookieParser = require('cookie-parser')

const AppError = require('./utils/appError')
const globalErrorHandler = require('./controllers/errorController')

const tourRouter = require('./routes/tourRouter')
const userRouter = require('./routes/userRouter')
const reviewRouter = require('./routes/reviewRoute')
const viewRouter = require('./routes/viewRoute')
const bookingRouter = require('./routes/bookingRoute')

const app = express()

app.set('view engine', 'pug')
app.set('views', path.join(__dirname, 'views'))

app.use(express.static(path.join(__dirname, 'public')))

if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'))
}

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
  message: 'Too many request, please try again in an hour',
})

app.use(
  helmet({
    contentSecurityPolicy: false,
  })
)

// limit request
app.use('/api', limiter)

// limit json size and covert body from json to js object
app.use(express.json({ limit: '10kb' }))
app.use(express.urlencoded({ extended: true, limit: '10kb' }))

app.use(cookieParser())

// Prevent Mongo injection
app.use(mongoSanitize())

// Prevent xss attack
app.use(xss())

app.use(
  hpp({
    whitelist: [
      'duration',
      'ratingsAverage',
      'ratingsQuantity',
      'maxGroupSize',
      'difficulty',
      'price',
    ],
  })
)

app.use((req, res, next) => {
  console.log(req.cookies)
  next()
})

app.use('/', viewRouter)
app.use('/api/v1/tours', tourRouter)
app.use('/api/v1/users', userRouter)
app.use('/api/v1/reviews', reviewRouter)
app.use('/api/v1/bookings', bookingRouter)

//Add route above this line
app.all('*', (req, res, next) => {
  // res.status(404).json({
  //   status: 'Not found',
  //   message: `Cant find ${req.originalUrl} on this server`,
  // })
  const error = new AppError(`Cant find ${req.originalUrl} on this server`, 404)
  next(error)
})

app.use(globalErrorHandler)

module.exports = app
