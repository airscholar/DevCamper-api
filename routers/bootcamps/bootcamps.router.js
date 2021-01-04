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

const { protectRoute } = require('../../middleware/auth.middleware');

const Bootcamp = require('../../models/Bootcamp');
const advancedResults = require('../../middleware/advancedResults.middleware');

const courseRouter = require('../courses/courses.router');
const { authorize } = require('../../controllers/auth/auth.controller');

//reroute other courses routes to courses
router.use('/:bootcampId/courses', courseRouter);

router.route('/radius/:zipcode/:distance').get(getBootcampInRadius);
router.route('/:id/photo').put(protectRoute, uploadBootcampPhoto);

router
  .route('/')
  .get(advancedResults(Bootcamp, 'courses'), getAllBootcamps)
  .post(protectRoute, authorize(['pubisher', 'admin']), createNewBootcamp);
router
  .route('/:id')
  .get(advancedResults(Bootcamp, 'courses'), getBootcampById)
  .put(protectRoute, authorize(['publisher', 'admin']), updateBootcamp)
  .delete(protectRoute, authorize(['publisher', 'admin']), deleteBootcamp);

module.exports = router;
