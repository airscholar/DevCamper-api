const path = require('path');
const ErrorResponse = require('../../utils/errorResponse.helper');
const Bootcamp = require('../../models/Bootcamp');
const asyncHandler = require('../../middleware/asyncHandler.middleware');
const geocoder = require('../../utils/geocoder.helper');

// @desc      Get all bootcamps
// @route     GET /api/v1/bootcamps
// @access    Public
const getAllBootcamps = asyncHandler(async (req, res, next) => {
  res.status(200).send(res.advancedResults);
});

// @desc      Get single bootcamp
// @route     GET /api/v1/bootcamp/:id
// @access    Public
const getBootcampById = asyncHandler(async (req, res, next) => {
  const bootcamp = await Bootcamp.findById(req.params.id).populate('courses');

  if (!bootcamp) {
    return next(
      new ErrorResponse(`Bootcamp with id: ${req.params.id} not found`, 404)
    );
  }

  res.status(200).send({
    success: true,
    message: 'Bootcamp data fetched successfully!',
    data: bootcamp,
  });
});

// @desc      Create a new bootcamp
// @route     POST /api/v1/bootcamps
// @access    Private
const createNewBootcamp = asyncHandler(async (req, res, next) => {
  // Add user to req.body
  req.body.user = req.user.id;

  // check if user has already created a bootcamp
  const publishedBootcamp = await Bootcamp.findOne({ user: req.user.id });

  if (publishedBootcamp && req.user.role !== 'admin') {
    return next(
      new ErrorResponse(
        `User with ID ${req.user.id} has already published a bootcamp`,
        400
      )
    );
  }

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
  //find bootcamp and update
  let bootcamp = await Bootcamp.findById(req.params.id);

  if (!bootcamp) {
    return next(
      new ErrorResponse(`Bootcamp with id: ${req.params.id} not found`, 404)
    );
  }

  //check the user to ensure the updating user is the creator
  if (
    req.user.id.toString() !== bootcamp.user.toString() &&
    req.user.role !== 'admin'
  ) {
    return next(
      new ErrorResponse(
        `User ${req.user.id} not authorized to update this bootcamp`,
        403
      )
    );
  }

  bootcamp = await Bootcamp.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });

  res.status(200).send({
    success: true,
    message: `Update bootcamp ${req.params.id} successfully!`,
    data: bootcamp,
  });
});

// @desc      Delete single bootcamp
// @route     GET /api/v1/bootcamps/:id
// @access    private
const deleteBootcamp = asyncHandler(async (req, res, next) => {
  const bootcamp = await Bootcamp.findById(req.params.id);

  if (!bootcamp) {
    return next(
      new ErrorResponse(`Bootcamp with id: ${req.params.id} not found`, 404)
    );
  }

  //check the user to ensure the deleting user is the creator
  if (
    req.user.id.toString() !== bootcamp.user.toString() &&
    req.user.role !== 'admin'
  ) {
    return next(
      new ErrorResponse(
        `User ${req.user.id} not authorized to delete this bootcamp`,
        403
      )
    );
  }

  bootcamp.remove();

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
  //get zipcode and distance
  const { zipcode, distance } = req.params;

  //get location details from geocode using zipcode
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

// @desc      Upload bootcamp photo
// @route     PUT /api/v1/bootcamps/:id/photo
// @access    private
const uploadBootcampPhoto = asyncHandler(async (req, res, next) => {
  const bootcamp = await Bootcamp.findById(req.params.id);

  if (!bootcamp) {
    return next(
      new ErrorResponse(`Bootcamp with id: ${req.params.id} not found`, 404)
    );
  }

   //check the user to ensure the update user is the creator
   if (
    req.user.id.toString() !== bootcamp.user.toString() &&
    req.user.role !== 'admin'
  ) {
    return next(
      new ErrorResponse(
        `User ${req.user.id} not authorized to update this bootcamp`,
        403
      )
    );
  }

  //continue uploading if condition is met
  if (!req.files) {
    return next(new ErrorResponse('Please upload a file', 400));
  }

  const file = req.files.file;

  //check file type
  if (!file.mimetype.startsWith('image')) {
    return next(new ErrorResponse('Please upload an image file', 400));
  }

  //check file size
  if (!file.size > process.env.MAX_FILE_UPLOAD_SIZE) {
    return next(
      new ErrorResponse(
        `File size cannot be greater than ${process.env.MAX_FILE_UPLOAD_SIZE}`,
        400
      )
    );
  }

  //create custom filename
  file.name = `photo_${bootcamp._id}${path.parse(file.name).ext}`;

  file.mv(`${process.env.FILE_UPLOAD_PATH}/${file.name}`, async (err) => {
    if (err) {
      console.log(err);
      return next(new ErrorResponse(`Problem with file upload`, 500));
    }
    await Bootcamp.findByIdAndUpdate(req.params.id, {
      photo: file.name,
    });

    res.status(200).json({
      success: true,
      data: file.name,
    });
  });
  // res.status(200).send({
  //   success: true,
  //   message: `Deleted bootcamp ${req.params.id} successfully!`,
  //   count: bootcamp.length,
  // });
});

module.exports = {
  getAllBootcamps,
  createNewBootcamp,
  updateBootcamp,
  deleteBootcamp,
  getBootcampById,
  getBootcampInRadius,
  uploadBootcampPhoto,
};
