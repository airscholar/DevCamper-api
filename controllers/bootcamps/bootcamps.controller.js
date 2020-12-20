const ErrorResponse = require('../../utils/errorResponse.helper');
const Bootcamp = require('../../models/Bootcamp');
const asyncHandler = require('../../middleware/asyncHandler.middleware');
const geocoder = require('../../utils/geocoder.helper');

// @desc      Get all bootcamps
// @route     GET /api/v1/bootcamps
// @access    Public
const getAllBootcamps = asyncHandler(async (req, res, next) => {
  let query;

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
  query = Bootcamp.find(JSON.parse(queryStr)).populate({
    path: 'courses',
    select: 'title description minimumSkill tuition',
  });

  // select field
  if (req.query.select) {
    const fields = req.query.select.split(',').join(' ');
    query = query.select(fields);
  }

  // sort field
  if (req.query.sort) {
    const sortBy = req.query.sort.split(',').join(' ');
    query = query.sort(sortBy);
  } else {
    query = query.sort('-createdAt');
  }

  // pagination
  const page = parseInt(req.query.page, 10) || 1;
  const limit = parseInt(req.query.limit, 10) || 25;
  const startIndex = (page - 1) * limit;
  const endIndex = page * limit;
  const total = await Bootcamp.countDocuments();

  query = query.skip(startIndex).limit(limit);

  // execute query
  const bootcamps = await query;

  // pagination result
  const pagination = {};

  if (endIndex < total) {
    pagination.next = {
      page: page + 1,
      limit,
    };
  }

  if (startIndex > 0) {
    pagination.prev = {
      page: page - 1,
      limit,
    };
  }

  res.status(200).send({
    success: true,
    count: bootcamps.length,
    pagination,
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
    return next(err);
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
    return next(
      new ErrorResponse(`Bootcamp with id: ${req.params.id} not found`, 404)
    );
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
    return next(
      new ErrorResponse(`Bootcamp with id: ${req.params.id} not found`, 404)
    );
  }

  res.status(200).send({
    success: true,
    message: `Deleted bootcamp ${req.params.id} successfully!`,
    count: bootcamp.length,
  });
});

// @desc      Get bootcamp in radius
// @route     GET /api/v1/bootcamps/radius/:zipcode/:distance
// @access    Public
const getBootcampInRadius = asyncHandler(async (req, res, next) => {
  const { zipcode, distance } = req.params;

  const loc = await geocoder.geocode(zipcode);

  const lng = loc[0].longitude;
  const lat = loc[0].latitude;

  //calculate the radius using radians
  //diving distance by radius of the earth
  //earth radius = 3963 mi / 6378 km
  const radius = distance / 3963;

  const bootcamps = await Bootcamp.find({
    location: {
      $geoWithin: { $centerSphere: [[lng, lat], radius] },
    },
  });

  res.status(200).json({
    success: true,
    count: bootcamps.length,
    data: bootcamps,
  });
});

module.exports = {
  getAllBootcamps,
  createNewBootcamp,
  updateBootcamp,
  deleteBootcamp,
  getBootcampById,
  getBootcampInRadius,
};
