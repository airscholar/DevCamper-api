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
const { protectRoute } = require('../../middleware/auth.middleware');
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
  .post(protectRoute, addCourse);

router
  .route('/:id')
  .get(
    advancedResults(Course, {
      path: 'bootcamp',
      select: 'name description email',
    }),
    getSingleCourse
  )
  .put(protectRoute, updateCourse)
  .delete(protectRoute, deleteCourse);

module.exports = router;
