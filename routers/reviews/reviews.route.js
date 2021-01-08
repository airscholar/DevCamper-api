const express = require('express');
const router = express.Router({ mergeParams: true });
const {
  getAllReviews,
  getReview,
  createReview,
} = require('../../controllers/reviews/reviews.controller');

const advancedResults = require('../../middleware/advancedResults.middleware');
const { protectRoute, authorize } = require('../../middleware/auth.middleware');
const Review = require('../../models/Review');

router
  .route('/')
  .get(
    advancedResults(Review, {
      path: 'bootcamp',
      select: 'name description email',
    }),
    getAllReviews
  )
  .post(protectRoute, authorize('admin', 'user'), createReview);
router.route('/:id').get(getReview);

module.exports = router;
