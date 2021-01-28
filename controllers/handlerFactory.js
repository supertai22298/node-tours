const ApiFeatures = require('../utils/apiFeature')
const AppError = require('../utils/appError')
const catchAsync = require('../utils/catchAsync')

exports.deleteOne = (Model) =>
  catchAsync(async (req, res, next) => {
    const doc = await Model.findByIdAndDelete(req.params.id)
    if (!doc) return next(new AppError('No document found with that id', 404))
    return res.status(204).json({
      status: 'Success',
      data: null,
    })
  })

exports.updateOne = (Model) =>
  catchAsync(async (req, res, next) => {
    const doc = await Model.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    })
    if (!doc) return next(new AppError('No document found with that id', 404))
    return res.status(200).json({
      status: 'Success',
      data: { data: doc },
    })
  })

exports.createOne = (Model) =>
  catchAsync(async (req, res, next) => {
    console.log('request:', req.body)
    const newDoc = await Model.create([req.body], { runValidators: true })

    if (!newDoc)
      return next(
        new AppError('Cannot create the document. Please try again', 404)
      )

    return res.status(201).json({
      status: 'success',
      data: {
        data: newDoc,
      },
    })
  })

exports.getOne = (Model, populateOptions) =>
  catchAsync(async (req, res, next) => {
    let query = Model.findById(req.params.id)

    if (populateOptions) query = query.populate(populateOptions)

    // const doc = await query.explain() to get the stats of query
    const doc = await query

    if (!doc) return next(new AppError('Cant find any document', 404))

    return res.status(200).json({
      status: 'Success',
      data: { data: doc },
    })
  })

exports.getAll = (Model) =>
  catchAsync(async (req, res, next) => {
    let filter = {}
    const { tourId } = req.params
    if (tourId) filter = { ...filter, tour: tourId }

    // Execute query
    const features = new ApiFeatures(Model.find(filter), req.query)
      .filter()
      .sort()
      .limitFields()
      .paginate()
    const docs = await features.query
    // const docs = await features.query.explain()

    return res.status(200).json({
      status: 'Success',
      result: docs.length,
      data: { data: docs },
    })
  })
