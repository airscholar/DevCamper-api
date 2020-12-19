const express = require('express');
const router = express.Router();
const coursesController = require('../../controllers/courses/courses.controller');

router
  .route('/')
  .get(coursesController.getAllCourses);

module.exports = router;
