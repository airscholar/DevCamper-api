const ErrorResponse = require('../../utils/errorResponse.helper');
const Course = require('../../models/Course');
const asyncHandler = require('../../middleware/asyncHandler.middleware');

// @desc      Get all courses
// @route     GET /api/v1/courses
// @route     GET /api/v1/bootcamps/:bootcampId/courses
// @access    Public

const getAllCourses = asyncHandler(async (req, res, next) => {
  let query;

  if (req.params.bootcampId) {
    query = Course.find({ bootcampId: req.params.bootcampId });
  } else {
    query = Course.find();
  }

  console.log('hit me')
  const courses = await query;

  res.status(200).json({
    success: true,
    message: 'Courses fetched successfully',
    count: courses.length,
    data: courses,
  });
}); 

module.exports = {
  getAllCourses,
};
