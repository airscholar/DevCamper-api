const mongoose = require('mongoose');

const ReviewSchema = new mongoose.Schema({
  title: {
    type: String,
    trim: true,
    required: [true, 'Please add a title for the review'],
    maxlength: 100,
  },
  text: {
    type: String,
    required: [true, 'Please add some text'],
  },

  rating: {
    type: Number,
    min: 1,
    max: 10,
    required: [true, 'Please add a rating between 1 and 10'],
  },
  user: {
    type: String,
    required: [true, 'Please add a tuition cost'],
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  modifiedAt: {
    type: Date,
    default: Date.now,
  },
  bootcamp: {
    type: mongoose.Schema.ObjectId,
    ref: 'Bootcamp',
    required: true,
  },
  user: {
    type: mongoose.Schema.ObjectId,
    ref: 'User',
    required: true,
  },
}); 

// prevent user from adding more than one review per bootcamp
ReviewSchema.index({ bootcamp: 1, user: 1 }, { unique: true });

// Static method to get average rating
ReviewSchema.statics.getAverageRating = async function (bootcampId) {
  // console.log(`Calculating average Rating`.green);

  const obj = await this.aggregate([
    {
      $match: { bootcamp: bootcampId },
    },
    {
      //set the average grouping field
      $group: {
        _id: '$bootcamp',
        averageRating: { $avg: '$rating' },
      },
    },
  ]);

  try {
    await this.model('Bootcamp').findByIdAndUpdate(bootcampId, {
      averageRating: obj[0].averageRating,
    });
  } catch (error) {
    console.log(error);
  }
};

// Calculate average rating after saving Review
ReviewSchema.post('save', function () {
  // console.log(`Calculating average rating before saving`.blue);
  this.constructor.getAverageRating(this.bootcamp);
  // next();
});

// Recalculate average rating before removal
ReviewSchema.pre('remove', function () {
  // console.log(`Calculating average rating before removal`.blue);
  this.constructor.getAverageRating(this.bootcamp);
});

module.exports = mongoose.model('Review', ReviewSchema);
