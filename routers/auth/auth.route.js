const express = require('express');
const { registerUser } = require('../../controllers/users/users.controller');

const router = express.Router();

router.post('/register', registerUser);

module.exports = router;
