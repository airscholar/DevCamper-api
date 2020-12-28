const express = require('express');
const router = express.Router();
const {
  getBootcampInRadius,
  getAllBootcamps,
  createNewBootcamp,
  getBootcampById,
  updateBootcamp,
  deleteBootcamp,
  uploadBootcampPhoto,
} = require('../../controllers/bootcamps/bootcamps.controller');

const Bootcamp = require('../../models/Bootcamp');
const advancedResults = require('../../middleware/advancedResults');

const courseRouter = require('../courses/courses.router');

//reroute other courses routes to courses
router.use('/:bootcampId/courses', courseRouter);

router.route('/radius/:zipcode/:distance').get(getBootcampInRadius);
router.route('/:id/photo').put(uploadBootcampPhoto);

router
  .route('/')
  .get(advancedResults(Bootcamp, 'courses'), getAllBootcamps)
  .post(createNewBootcamp);
router
  .route('/:id')
  .get(advancedResults(Bootcamp, 'courses'),  getBootcampById)
  .put(updateBootcamp)
  .delete(deleteBootcamp);

module.exports = router;
