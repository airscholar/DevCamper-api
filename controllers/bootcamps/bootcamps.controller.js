const ErrorResponse = require('../../utils/errorResponse.helper')
const Bootcamp = require('../../models/Bootcamp');
const asyncHandler = require('../../middleware/asyncHandler.middleware')

// @desc      Get all bootcamps
// @route     GET /api/v1/bootcamps
// @access    Public
const getAllBootcamps = asyncHandler(async (req, res, next) => {
    const bootcamps = await Bootcamp.find();
  
    res.status(200).send({
      success: true,
      message: 'Show all bootcamps',
      data: bootcamps,
    });

});

// @desc      Get single bootcamp
// @route     GET /api/v1/bootcamp/:id
// @access    Public
const getBootcampById = asyncHandler(async (req, res, next) => {
    const bootcamp = await Bootcamp.findById(req.params.id);

    if (!bootcamp) {
      return next(err)
    }

    res.status(200).send({
      success: true,
      message: `Get bootcamp ${req.params.id}`,
      data: bootcamp,
    });

});

// @desc      Create a new bootcamp
// @route     POST /api/v1/bootcamps
// @access    Private
const createNewBootcamp = asyncHandler(async (req, res, next) => {
    const bootcamp = await Bootcamp.create(req.body);

    res.status(201).send({
      success: true,
      message: bootcamp,
    });
});

// @desc      Update bootcamp
// @route     PUT /api/v1/bootcamps/:id
// @access    Public
const updateBootcamp = asyncHandler(async (req, res, next) => {
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
});

// @desc      Delete single bootcamp
// @route     GET /api/v1/bootcamps
// @access    private
const deleteBootcamp = asyncHandler(async (req, res, next) => {
    const bootcamp = await Bootcamp.findByIdAndDelete(req.params.id);

    if (!bootcamp) {
      return next(new ErrorResponse(`Bootcamp with id: ${req.params.id} not found`, 404))
    }

    res.status(200).send({
      success: true,
      message: `Deleted bootcamp ${req.params.id} successfully!`,
      count: bootcamp.length,
    });
});
module.exports = {
  getAllBootcamps,
  createNewBootcamp,
  updateBootcamp,
  deleteBootcamp,
  getBootcampById,
};
