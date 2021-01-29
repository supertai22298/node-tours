const mongoose = require('mongoose')
const slugify = require('slugify')

const tourSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'A tour must have a name'],
      unique: true,
      trim: true,
      maxlength: [40, 'A tour name must have less or equal 40 characters'],
      minlength: [10, 'A tour name must have more than 10 characters'],
    },
    slug: String,
    duration: {
      type: Number,
      required: [true, 'A tour must have a duration'],
    },
    maxGroupSize: {
      type: Number,
      required: [true, 'A tour must have a group size'],
    },
    difficulty: {
      type: String,
      required: [true, 'A tour must have a difficulty'],
    },
    ratingsAverage: {
      type: Number,
      default: 4.5,
    },
    ratingsQuantity: {
      type: Number,
      default: 0,
    },
    price: {
      type: Number,
      required: true,
    },
    discount: Number,
    summary: {
      type: String,
      trim: true,
      required: [true, 'A tour must have a summary'],
    },
    description: {
      type: String,
      trim: true,
    },
    imageCover: {
      type: String,
      required: [true, 'A tour must have a cover image'],
    },
    images: {
      type: [String],
    },
    createdAt: {
      type: Date,
      default: Date.now(),
      select: false,
    },
    startDates: {
      type: [Date],
    },
    secretTour: {
      type: Boolean,
      default: false,
    },
    startLocation: {
      type: {
        type: String,
        default: 'Point',
        enum: ['Point'],
      },
      address: String,
      coordinates: [Number],
      description: String,
    },
    location: [
      {
        type: {
          type: String,
          default: 'Point',
          enum: ['Point'],
        },
        address: String,
        coordinates: [Number],
        description: String,
        day: Number,
      },
    ],
    guides: [
      {
        type: mongoose.Schema.ObjectId,
        ref: 'User',
      },
    ],
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
)

// tourSchema.index({ price: 1 })
tourSchema.index({ price: 1, ratingsAverage: -1 })
tourSchema.index({ slug: 1 })
tourSchema.index({ startLocation: '2dsphere' })

const durationWeeks = tourSchema.virtual('durationWeeks')

durationWeeks.get(function () {
  return this.duration / 7
})

tourSchema.virtual('reviews', {
  ref: 'Review',
  foreignField: 'tour',
  localField: '_id',
})
// Document middleware: runs on save() and create()
tourSchema.pre('save', function (next) {
  this.slug = slugify(this.name, {
    lower: true,
  })
  next()
})

/*
Embedding the document to other
tourSchema.pre('save', async function (next) {
  const guidesPromises = this.guides.map(async (id) => await User.findById(id))
  this.guides = await Promise.all(guidesPromises)
  next()
})*/

tourSchema.post('save', function (doc, next) {
  console.log(doc)
  next()
})

// Query middleware
tourSchema.pre(/^find/, function (next) {
  this.find({ secretTour: { $ne: true } })
  this.start = Date.now()
  next()
})

tourSchema.pre(/^find/, function (next) {
  this.populate({
    path: 'guides',
    select: '-passwordChangedAt -__v -email',
  })
  next()
})

tourSchema.post(/^find/, function (docs, next) {
  console.log(`Query took ${Date.now() - this.start} ms`)
  next()
})

// Aggregation middleware
// tourSchema.pre('aggregate', function (next) {
//   this.pipeline().unshift({
//     $match: { secretTour: { $ne: true } },
//   })

//   console.log(this.pipeline())
//   next()
// })

const Tour = mongoose.model('Tour', tourSchema)

module.exports = Tour
