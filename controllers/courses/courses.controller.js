const ErrorResponse = require('../../utils/errorResponse.helper');
const Course = require('../../models/Course');
const Bootcamp = require('../../models/Bootcamp');
const asyncHandler = require('../../middleware/asyncHandler.middleware');

// @desc      Get all courses
// @route     GET /api/v1/courses
// @route     GET /api/v1/bootcamps/:bootcampId/courses
// @access    Public
const getAllCourses = asyncHandler(async (req, res, next) => {
  let query;

  if (req.params.bootcampId) {
    query = Course.find({ bootcamp: req.params.bootcampId }).populate({
      path: 'bootcamp',
    });
  } else {
    query = Course.find().populate({
      path: 'bootcamp',
      select: 'name description ',
    });
  }

  const courses = await query;

  res.status(200).json({
    success: true,
    message: 'Courses fetched successfully',
    count: courses.length,
    data: courses,
  });
});

// @desc      Get single courses
// @route     GET /api/v1/bootcamps/:bootcampId/course/
// @access    Public
const getSingleCourse = asyncHandler(async (req, res, next) => {
  const courses = await Course.findById(req.params.id).populate({
    path: 'bootcamp',
  });

  if (!courses) {
    return next(
      new ErrorResponse(`Course with id of ${req.params.id} not found`, 404)
    );
  }

  return res.status(200).json({
    success: true,
    message: 'Course fetched successfully',
    count: courses.length,
    data: courses,
  });
});

// @desc      Add a new course
// @route     POST /api/v1/bootcamps/:bootcampId/courses
// @access    Private
const addCourse = asyncHandler(async (req, res, next) => {
  
  //check for bootcamp existence
  req.body.bootcamp = req.params.bootcampId;

  const bootcamp = await Bootcamp.findById(req.params.bootcampId);

  if(!bootcamp){
    return next(new ErrorResponse(`No bootcamp with id ${req.params.bootcampId} found`, 404))
  }

  const course = await Course.create(req.body);

  res.status(201).json({
    success: true,
    message: 'Course created successfully',
    data: course,
  });
});

module.exports = {
  getAllCourses,
  getSingleCourse,
  addCourse,
};
