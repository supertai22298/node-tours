const express = require('express')
const fs = require('fs')

const app = express()
app.use(express.json())

const tours = JSON.parse(
  fs.readFileSync(`${__dirname}/dev-data/data/tours-simple.json`)
)

const getAllTour = (req, res) => {
  res.status(200).json({
    status: 'Success',
    result: tours.length,
    data: { tours },
  })
}

const createNewTour = (req, res) => {
  const newId = tours[tours.length - 1].id + 1

  const newTour = Object.assign({ id: newId }, req.body)

  tours.push(newTour)

  fs.writeFile(
    `${__dirname}/dev-data/data/tours-simple.json`,
    JSON.stringify(tours),
    (err) => {
      res.status(201).json({
        status: 'success',
        data: {
          tour: newTour,
        },
      })
    }
  )
}

const getTourById = (req, res) => {
  const id = +req.params.id

  const tour = tours.find((item) => item.id === id)

  if (!tour) {
    res.status(404).json({
      status: 'false',
      message: 'Could not find any tour',
    })
  }
  res.status(200).json({
    status: 'Success',
    data: { tour },
  })
}
const updateTourById = (req, res) => {
  const id = +req.params.id
  const tour = tours.find((item) => item.id === id)

  if (!tour) {
    res.status(404).json({
      status: 'false',
      message: 'Could not find any tour',
    })
  }

  res.status(200).json({
    status: 'Success',
    data: { tour: '<Update tour here>' },
  })
}
const deleteTourById = (req, res) => {
  const id = +req.params.id
  const tour = tours.find((item) => item.id === id)

  if (!tour) {
    res.status(404).json({
      status: 'false',
      message: 'Could not find any tour',
    })
  }

  res.status(200).json({
    status: 'Success',
    data: { tour: '<Delete tour here>' },
  })
}

const TOUR_API_URL = '/api/v1/tours'

// app.get(TOUR_API_URL, getAllTour)
// app.post(TOUR_API_URL, createNewTour)
// app.get(`${TOUR_API_URL}/:id`, getTourById)
// app.patch(`${TOUR_API_URL}/:id`, updateTourById)
// app.delete(`${TOUR_API_URL}/:id`, deleteTourById)

app.route(TOUR_API_URL).get(getAllTour).post(createNewTour)

app
  .route(`${TOUR_API_URL}/:id`)
  .get(getTourById)
  .patch(updateTourById)
  .delete(deleteTourById)

const PORT = 3000
app.listen(PORT, () => {
  console.log(`App is running at http://localhost:${PORT}`)
})
