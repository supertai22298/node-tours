const dotenv = require('dotenv')
const mongoose = require('mongoose')

dotenv.config({ path: './config.env' })

const app = require('./app')

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

app.listen(PORT, () => {
  console.log(`App is running at http://localhost:${PORT}`)
})
