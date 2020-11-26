const express = require('express');

// GET /api/v1/bootcamps
const getAllBootcamps = (req, res, next) => {
  res.status(200).send({
    success: true,
    message: 'Show all bootcamps',
  });
};

// GET /api/v1/bootcamps/1
const getBootcampById = (req, res, next) => {
  res.status(200).send({
    success: true,
    message: `Get bootcamp ${req.params.id}`,
  });
};

// POST /api/v1/bootcamps
const createNewBootcamp = (req, res, next) => {
  res.status(201).send({
    success: true,
    message: 'Create new bootcamp',
  });
};

// PUT /api/v1/bootcamps/1
const updateBootcamp = (req, res, next) => {
  res.status(200).send({
    success: true,
    message: `Update bootcamp ${req.params.id}`,
  });
};

// DELETE /api/v1/bootcamps/1
const deleteBootcamp = (req, res, next) => {
  res.status(200).send({
    success: true,
    message: `Delete bootcamp ${req.params.id}`,
  });
};
module.exports = {
  getAllBootcamps,
  createNewBootcamp,
  updateBootcamp,
  deleteBootcamp,
  getBootcampById,
};
