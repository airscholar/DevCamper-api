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
  } 
  else {
    // copy req.query
    let reqQuery = { ...req.query };
  
    // fields to exclude
    const removeFields = ['select', 'sort', 'limit', 'page'];
  
    removeFields.forEach((param) => delete reqQuery[param]);
  
    console.log(reqQuery);
  
    // create query string
    let queryStr = JSON.stringify(reqQuery);
    // create operators ($gte, $gt, etc)
    queryStr = queryStr.replace(
      /\b(gt|gte|lt|lte|in)\b/g,
      (match) => `$${match}`
    );
  
    // find resource with query param
    query = Course.find(JSON.parse(queryStr)).populate({
      path: 'bootcamp',
      select: 'name description email',
    });
  
    // select field
    if (req.query.select) {
      const fields = req.query.select.split(',').join(' ');
      console.log(fields)
      query = query.select(fields);
    }
  
    // sort field
    if (req.query.sort) {
      const sortBy = req.query.sort.split(',').join(' ');
      query = query.sort(sortBy);
    } else {
      query = query.sort('-createdAt');
    }
    
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

  if (!bootcamp) {
    return next(
      new ErrorResponse(
        `No bootcamp with id ${req.params.bootcampId} found`,
        404
      )
    );
  }

  const course = await Course.create(req.body);

  res.status(201).json({
    success: true,
    message: 'Course created successfully',
    data: course,
  });
});

// @desc      Update a course
// @route     POST /api/v1/courses/:id
// @access    Private
const updateCourse = asyncHandler(async (req, res, next) => {
  let course = await Course.findById(req.params.id);

  if (!course) {
    return next(
      new ErrorResponse(`No course with id ${req.params.bootcampId} found`, 404)
    );
  }

  course = await Course.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });

  res.status(201).json({
    success: true,
    message: 'Course updated successfully',
    data: course,
  });
});

// @desc      Delete a course
// @route     PELETE /api/v1/courses/:id
// @access    Private
const deleteCourse = asyncHandler(async (req, res, next) => {
  let course = await Course.findById(req.params.id);

  if (!course) {
    return next(
      new ErrorResponse(`No course with id ${req.params.bootcampId} found`, 404)
    );
  }

  course.remove();

  res.status(201).json({
    success: true,
    message: 'Course deleted successfully',
    data: {},
  });
});

module.exports = {
  getAllCourses,
  getSingleCourse,
  addCourse,
  updateCourse,
  deleteCourse,
};
