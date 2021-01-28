const dotenv = require('dotenv')
const mongoose = require('mongoose')
const fs = require('fs')
const Tour = require('./models/tourModel')
const User = require('./models/userModel')
const Review = require('./models/reviewModel')

dotenv.config({ path: './config.env' })

const { PORT, DATABASE_URI, DATABASE_PASSWORD } = process.env
const connectionString = DATABASE_URI.replace('<PASSWORD>', DATABASE_PASSWORD)

mongoose
  .connect(connectionString, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useFindAndModify: false,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log('DB connected')
  })

const tours = JSON.parse(
  fs.readFileSync('./dev-data/data/tours.json', {
    encoding: 'utf-8',
  })
)
const users = JSON.parse(
  fs.readFileSync('./dev-data/data/users.json', {
    encoding: 'utf-8',
  })
)
const reviews = JSON.parse(
  fs.readFileSync('./dev-data/data/reviews.json', {
    encoding: 'utf-8',
  })
)

const importData = async () => {
  try {
    await Tour.create(tours)
    await User.create(users, { runValidators: false })
    await Review.create(reviews)
    console.log('Insert Success')
    process.exit()
  } catch (error) {
    console.log(error)
  }
}
const deleteData = async () => {
  try {
    await Tour.deleteMany()
    await User.deleteMany()
    await Review.deleteMany()
    console.log('Delete success')
    process.exit()
  } catch (error) {
    console.log(error)
  }
}

if (process.argv[2] === '--import') {
  importData()
} else if (process.argv[2] === '--delete') {
  deleteData()
} else {
  console.log(
    'Console will exit in 3s, use --import or ---delete to handle data'
  )
  let timeOut = 3
  setInterval(() => {
    console.log(`${timeOut}`)
    timeOut -= 1
    if (timeOut < 0) {
      process.exit()
    }
  }, 1000)
}
