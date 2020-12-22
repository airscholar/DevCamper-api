const express = require('express');
const router = express.Router({ mergeParams: true });
const {
  getAllCourses,
  getSingleCourse,
  addCourse,
  updateCourse,
  deleteCourse,
} = require('../../controllers/courses/courses.controller');

router
  .route('/')
  .get(getAllCourses)
  .post(addCourse);

router
  .route('/:id')
  .get(getSingleCourse)
  .put(updateCourse)
  .delete(deleteCourse)

module.exports = router;
