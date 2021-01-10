const ErrorResponse = require('../../utils/errorResponse.helper');
const Review = require('../../models/Review');
const Bootcamp = require('../../models/Bootcamp');
const asyncHandler = require('../../middleware/asyncHandler.middleware');

// @desc      Get all reviews
// @route     GET /api/v1/reviews
// @route     GET /api/v1/bootcamps/:bootcampId/reviews
// @access    Public
const getAllReviews = asyncHandler(async (req, res, next) => {
  if (req.params.bootcampId) {
    const reviews = await Review.find({
      bootcamp: req.params.bootcampId,
    }).populate({
      path: 'bootcamp',
    });

    return res.status(200).json({
      success: true,
      count: reviews.length,
      data: reviews,
    });
  } else {
    res.status(200).json(res.advancedResults);
  }
});

// @desc      Get single review
// @route     GET /api/v1/reviews/:id
// @access    Public
const getReview = asyncHandler(async (req, res, next) => {
  const review = await Review.findById(req.params.id).populate({
    path: 'bootcamp',
    select: 'name description',
  });

  if (!review) {
    return next(
      new ErrorResponse(`No review with id ${req.params.id} found`, 400)
    );
  }

  return res.status(200).json({
    success: true,
    data: review,
  });
});

// @desc      Create review for bootcamp
// @route     POST /api/v1/bootcamps/:bootcampId/reviews
// @access    Private
const createReview = asyncHandler(async (req, res, next) => {
  req.body.bootcamp = req.params.bootcampId;
  req.body.user = req.user.id;

  const bootcamp = await Bootcamp.findById(req.params.bootcampId);

  if (!bootcamp) {
    return next(
      new ErrorResponse(`Bootcamp with Id ${req.params.bootcampId} not found!`)
    );
  }

  const review = await Review.create(req.body);

  return res.status(200).json({
    success: true,
    data: review,
  });
});

// @desc      Update review
// @route     POST /api/v1/reviews/:id
// @access    Private
const updateReview = asyncHandler(async (req, res, next) => {
  let review = await Review.findById(req.params.id);

  if (!review) {
    return next(
      new ErrorResponse(`Review with Id ${req.params.id} not found!`)
    );
  }

  review = await Review.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });

  //make sure that the user is the owner or the user is an admin
  if (
    review.bootcamp.id.toString() !== req.user.id.toString() &&
    req.user.role !== 'admin'
  ) {
    return next(
      new ErrorResponse('User not authorized to update this review', 400)
    );
  }

  return res.status(200).json({
    success: true,
    data: review,
  });
});

module.exports = { getAllReviews, getReview, createReview, updateReview };
