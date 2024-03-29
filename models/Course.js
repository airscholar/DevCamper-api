const mongoose = require('mongoose');

const CourseSchema = new mongoose.Schema({
  title: {
    type: String,
    trim: true,
    required: [true, 'Please add a course title'],
  },
  description: {
    type: String,
    required: [true, 'Please add a description'],
  },

  weeks: {
    type: String,
    required: [true, 'Please add number of weeks'],
  },
  tuition: {
    type: String,
    required: [true, 'Please add a tuition cost'],
  },
  minimumSkill: {
    type: String,
    required: [true, 'Please add a minimum skill'],
    enum: ['beginner', 'intermediate', 'advanced'],
  },
  scholarshipAvailable: {
    type: Boolean,
    default: false,
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

// Static method to get average cost of tuition
CourseSchema.statics.getAverageCost = async function (bootcampId) {
  // console.log(`Calculating average cost`.green);

  const obj = await this.aggregate([
    {
      $match: { bootcamp: bootcampId },
    },
    {
      //set the average grouping field
      $group: {
        _id: '$bootcamp',
        averageCost: { $avg: '$tuition' },
      },
    },
  ]);

  try {
    await this.model('Bootcamp').findByIdAndUpdate(bootcampId, {
      averageCost: Math.ceil(obj[0].averageCost / 10) * 10,
    });
  } catch (error) {
    console.log(error);
  }
};

// // Static method to get average cost of tuition
// CourseSchema.statics.getAverageCost = async function (bootcampId) {
//   console.log(`Calculating average cost`.green);

//   const obj = await this.aggregate([
//     {
//       $group: {
//         _id: '$bootcamp',
//         // avgAmount: { $avg: { $multiply: ['$price', '$quantity'] } },
//         avgQuantity: { $avg: '$tuition' },
//       },
//     },
//   ]);

//   console.log(obj);
// };

// Calculate average cost after saving course
CourseSchema.post('save', function () {
  // console.log(`Calculating average cost before saving`.blue);
  this.constructor.getAverageCost(this.bootcamp);
  // next();
});

// Recalculate average cost before removal
CourseSchema.pre('remove', function () {
  // console.log(`Calculating average cost before removal`.blue);
  this.constructor.getAverageCost(this.bootcamp);
});
module.exports = mongoose.model('Course', CourseSchema);
