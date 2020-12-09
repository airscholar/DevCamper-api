const express = require('express');
const router = express.Router();
const bootcampController = require('../../controllers/bootcamps/bootcamps.controller');

router
  .route('/radius/:zipcode/:distance')
  .get(bootcampController.getBookcampInRadius);

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
