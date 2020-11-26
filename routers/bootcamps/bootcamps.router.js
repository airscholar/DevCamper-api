const express = require('express');
const router = express.Router();
const bootcampController = require('../../controllers/bootcamps/bootcamps.controller');

router.get('/', bootcampController.getAllBootcamps);
router.get('/:id', bootcampController.getBootcampById);
router.post('/', bootcampController.createNewBootcamp);
router.put(`/:id`, bootcampController.updateBootcamp);
router.delete('/:id', bootcampController.deleteBootcamp);

module.exports = router;
