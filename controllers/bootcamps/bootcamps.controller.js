const ErrorResponse = require('../../utils/errorResponse.helper')
const Bootcamp = require('../../models/Bootcamp');

// @desc      Get all bootcamps
// @route     GET /api/v1/bootcamps
// @access    Public
const getAllBootcamps = async (req, res, next) => {
  try {
    const bootcamps = await Bootcamp.find();
  
    res.status(200).send({
      success: true,
      message: 'Show all bootcamps',
      data: bootcamps,
    });
    
  } catch (error) {
    next(error)
  }
};

// @desc      Get single bootcamp
// @route     GET /api/v1/bootcamp/:id
// @access    Public
const getBootcampById = async (req, res, next) => {
  try {
    const bootcamp = await Bootcamp.findById(req.params.id);

    if (!bootcamp) {
      return next(err)
    }

    res.status(200).send({
      success: true,
      message: `Get bootcamp ${req.params.id}`,
      data: bootcamp,
    });
  } catch (err) {
    return next()
  }
};

// @desc      Create a new bootcamp
// @route     POST /api/v1/bootcamps
// @access    Private
const createNewBootcamp = async (req, res, next) => {
  try {
    const bootcamp = await Bootcamp.create(req.body);

    res.status(201).send({
      success: true,
      message: bootcamp,
    });
  } catch (err) {
    next(err)
  }
};

// @desc      Update bootcamp
// @route     PUT /api/v1/bootcamps/:id
// @access    Public
const updateBootcamp = async (req, res, next) => {
  try {
    const bootcamp = await Bootcamp.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    if (!bootcamp) {
      return next(new ErrorResponse(`Bootcamp with id: ${req.params.id} not found`, 404))
    }

    res.status(200).send({
      success: true,
      message: `Update bootcamp ${req.params.id} successfully!`,
      data: bootcamp,
    });
  } catch (err) {
    next(err)
  }
};

// @desc      Delete single bootcamp
// @route     GET /api/v1/bootcamps
// @access    private
const deleteBootcamp = async (req, res, next) => {
  try {
    const bootcamp = await Bootcamp.findByIdAndDelete(req.params.id);

    if (!bootcamp) {
      return next(new ErrorResponse(`Bootcamp with id: ${req.params.id} not found`, 404))
    }

    res.status(200).send({
      success: true,
      message: `Deleted bootcamp ${req.params.id} successfully!`,
      count: bootcamp.length,
    });
  } catch (err) {
    next(err)
  }
};
module.exports = {
  getAllBootcamps,
  createNewBootcamp,
  updateBootcamp,
  deleteBootcamp,
  getBootcampById,
};
