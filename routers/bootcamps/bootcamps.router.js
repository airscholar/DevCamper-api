const express = require('express');
const router = express.Router();
const {
  getBootcampInRadius,
  getAllBootcamps,
  createNewBootcamp,
  getBootcampById,
  updateBootcamp,
  deleteBootcamp,
} = require('../../controllers/bootcamps/bootcamps.controller');
const courseRouter = require('../courses/courses.router');

//reroute other courses routes to courses
router.use('/:bootcampId/courses', courseRouter);

router.route('/radius/:zipcode/:distance').get(getBootcampInRadius);

router.route('/').get(getAllBootcamps).post(createNewBootcamp);
router
  .route('/:id')
  .get(getBootcampById)
  .put(updateBootcamp)
  .delete(deleteBootcamp);

module.exports = router;
