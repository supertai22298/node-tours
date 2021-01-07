const express = require('express')

const morgan = require('morgan')
const tourRouter = require('./routes/tourRoute')
const userRouter = require('./routes/userRoute')

const app = express()

app.use(morgan('dev'))
app.use(express.json())

app.use('/api/v1/tours', tourRouter)
app.use('/api/v1/users', userRouter)

const PORT = 3000
app.listen(PORT, () => {
  console.log(`App is running at http://localhost:${PORT}`)
})
