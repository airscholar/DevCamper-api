const express = require('express');
const router = express.Router();
const bootcampController = require('../../controllers/bootcamps/bootcamps.controller');
const courseRouter = require('../courses/courses.router');

//reroute other courses routes to courses
router.use('/:bootcampId/courses', courseRouter);

router
  .route('/radius/:zipcode/:distance')
  .get(bootcampController.getBootcampInRadius);

router
  .route('/')
  .get(bootcampController.getAllBootcamps)
  .post(bootcampController.createNewBootcamp);
router
  .route('/:id')
  .get(bootcampController.getBootcampById)
  .put(bootcampController.updateBootcamp)
  .delete(bootcampController.deleteBootcamp);

module.exports = router;
