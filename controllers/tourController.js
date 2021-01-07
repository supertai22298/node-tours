const fs = require('fs')

const tours = JSON.parse(
  fs.readFileSync(`${__dirname}/../dev-data/data/tours-simple.json`)
)

exports.getAllTour = (req, res) => {
  res.status(200).json({
    status: 'Success',
    result: tours.length,
    data: { tours },
  })
}
exports.createNewTour = (req, res) => {
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
exports.getTourById = (req, res) => {
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
exports.updateTourById = (req, res) => {
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
exports.deleteTourById = (req, res) => {
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