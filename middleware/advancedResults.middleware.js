const { populate } = require('../models/Course');

const advancedResults = (model, populate) => async (req, res, next) => {
  let query;

  // copy req.query
  let reqQuery = { ...req.query };

  // fields to exclude
  const removeFields = ['select', 'sort', 'limit', 'page'];

  removeFields.forEach(param => delete reqQuery[param]);

  // create query string
  // console.log(reqQuery);
  let queryStr = JSON.stringify(reqQuery);
  // console.log(queryStr);

  // create operators ($gte, $gt, etc)
  queryStr = queryStr.replace(/\b(gt|gte|lt|lte|in)\b/g, match => `$${match}`);

  // find resource with query param
  query = model.find(JSON.parse(queryStr));

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
  const total = await model.countDocuments();

  query = query.skip(startIndex).limit(limit);

  if (populate) {
    query = query.populate(populate);
  }

  // execute query
  const results = await query;

  // pagination result
  const pagination = {};

  //check endindex against total to enable and disable next
  if (endIndex < total) {
    pagination.next = {
      page: page + 1,
      limit,
    };
  }

  //check startindex against total to enable and disable previous
  if (startIndex > 0) {
    pagination.prev = {
      page: page - 1,
      limit,
    };
  }

  res.advancedResults = {
    success: true,
    count: results.length,
    pagination,
    data: results,
  };

  next();
};

module.exports = advancedResults;
