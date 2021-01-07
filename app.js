const express = require('express')
const app = express()

const PORT = 3000

app.get('/', (req, res) => {
  res.status(200).json({
    message: 'Success',
    result: 'Hello world',
  })
})

app.listen(PORT, () => {
  console.log(`App is running at http://localhost:${PORT}`)
})
