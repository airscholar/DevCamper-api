const express = require('express');
const router = express.Router({ mergeParams: true });
const {
  getAllCourses,
  getSingleCourse,
  addCourse,
  updateCourse,
  deleteCourse,
} = require('../../controllers/courses/courses.controller');

const advancedResults = require('../../middleware/advancedResults.middleware');
const Course = require('../../models/Course');

router
  .route('/')
  .get(
    advancedResults(Course, {
      path: 'bootcamp',
      select: 'name description email',
    }),
    getAllCourses
  )
  .post(addCourse);

router
  .route('/:id')
  .get(
    advancedResults(Course, {
      path: 'bootcamp',
      select: 'name description email',
    }),
    getSingleCourse
  )
  .put(updateCourse)
  .delete(deleteCourse);

module.exports = router;
