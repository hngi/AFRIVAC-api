/**
 * @file Manages all database queries related to the Review document(table)
 * @author Gabriel <gabrielsonchia@gmail.com> <20/06/2020 06:37am>
 * @since 0.1.0
 * Last Modified: Gabriel <Gabrielsonchia@gmail.com> <13/07/2020 06:17pm>
 */

const mongoose = require('mongoose');
const Destination = require('./PopularDestinations');

const reviewSchema = new mongoose.Schema(
  {
    review: {
      type: String,
      required: [true, 'Review can not be empty!']
    },
    rating: {
      type: Number,
      min: 1,
      max: 5
    },
    createdAt: {
      type: Date,
      default: Date.now
    },
    destination: {
      type: mongoose.Schema.ObjectId,
      ref: 'PopularDestinations',
      required: [true, 'Review must belong to a destination.']
    },
    user: {
      type: mongoose.Schema.ObjectId,
      ref: 'User',
      required: [true, 'Review must belong to a user']
    }
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
  }
);

/**
 * indexing
 */
reviewSchema.index({ destination: 1, user: 1 }, { unique: true }, { createdAt: -1 });

reviewSchema.pre(/^find/, function(next) {
  this.populate({
    path: 'user',
    select: 'name photo'
  });
  next();
});

/**
 * Create a static method on the plan schema to calculate the average of a given destination. Notice that this method
 * is a static method (schema.statics) because you want to query for a specific document from the plan model.
 * @param destinationId
 * @returns {*}
 */
reviewSchema.statics.calcAverageRatings = async function(destinationId) {
  const stats = await this.aggregate([
    {
      $match: { destination: destinationId }
    },
    {
      $group: {
        _id: '$destination',
        nRating: { $sum: 1 },
        avgRating: { $avg: '$rating' }
      }
    }
  ]);

  if (stats.length > 0) {
    await Destination.findByIdAndUpdate(destinationId, {
      ratingsQuantity: stats[0].nRating,
      ratingsAverage: stats[0].avgRating
    });
  } else {
    await Destination.findByIdAndUpdate(destinationId, {
      ratingsQuantity: 0,
      ratingsAverage: 4.5
    });
  }
};

/**
 * After saving user review, calculate the average rating for the reviewed destination
 */
reviewSchema.post('save', function() {
  // this points to current review
  this.constructor.calcAverageRatings(this.destination);
});

const Review = mongoose.model('Review', reviewSchema);

module.exports = Review;
