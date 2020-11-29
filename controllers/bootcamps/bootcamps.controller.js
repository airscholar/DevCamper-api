const Bootcamp = require('../../models/Bootcamp')

// @desc      Get all bootcamps
// @route     GET /api/v1/bootcamps
// @access    Public 
const getAllBootcamps = (req, res, next) => {
  res.status(200).send({
    success: true,
    message: 'Show all bootcamps',
  });
};

// @desc      Get single bootcamp
// @route     GET /api/v1/bootcamp/:id
// @access    Public 
const getBootcampById = (req, res, next) => {
  res.status(200).send({
    success: true,
    message: `Get bootcamp ${req.params.id}`,
  });
};

// @desc      Create a new bootcamp
// @route     POST /api/v1/bootcamps
// @access    Private 
const createNewBootcamp = async (req, res, next) => {

  const bootcamp = await Bootcamp.create(req.body);

  res.status(201).send({
    success: true,
    message: bootcamp,
  });
};

// @desc      Update bootcamp
// @route     PUT /api/v1/bootcamps/:id
// @access    Public 
const updateBootcamp = (req, res, next) => {
  res.status(200).send({
    success: true,
    message: `Update bootcamp ${req.params.id}`,
  });
};

// @desc      Delete single bootcamp
// @route     GET /api/v1/bootcamps
// @access    private 
const deleteBootcamp = (req, res, next) => {
  res.status(200).send({
    success: true,
    message: `Delete bootcamp ${req.params.id}`,
  });
};
module.exports = {
  getAllBootcamps,
  createNewBootcamp,
  updateBootcamp,
  deleteBootcamp,
  getBootcampById,
};
