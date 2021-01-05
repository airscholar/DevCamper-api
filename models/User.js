const crypto = require('crypto');
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const UserSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please enter a name'],
  },
  email: {
    type: String,
    required: [true, 'Please enter an email address'],
    unique: true,
    match: [
      /^([0-9a-zA-Z]([-.\w]*[0-9a-zA-Z])*@([0-9a-zA-Z][-\w]*[0-9a-zA-Z]\.)+[a-zA-Z]{2,9})$/,
      'Please add a valid email address',
    ],
  },
  role: {
    type: String,
    enum: ['user', 'publisher'],
    default: 'user',
  },
  password: {
    type: String,
    required: [true, 'Please enter a valid password'],
    select: false,
    minlength: 6,
  },
  resetPasswordToken: String,
  resetPasswordExpire: Date,
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

//Encrypt password with bcryptjs
UserSchema.pre('save', async function (next) {
  if(!this.isModified('password')){
    next();
  }

  const salt = await bcrypt.genSalt();
  this.password = await bcrypt.hash(this.password, salt);
});

// Sign JWT and return
UserSchema.methods.getSignedJwtToken = async function () {
  return jwt.sign({ id: this._id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRE,
  });
};

//generate and has token
UserSchema.methods.getResetPasswordToken = async function () {
  // generate token
  const resetToken = crypto.randomBytes(20).toString('hex');

  console.log(resetToken);

  // hash token and set it to resetPasswordToken
  this.resetPasswordToken = crypto
    .createHash('sha256')
    .update(resetToken)
    .digest('hex');

  // set expiry date
  this.resetPasswordExpire =
    Date.now() + process.env.FORGOT_PASSWORD_EXPIRY * 60 * 1000;

  return resetToken;
};

// Match user password with entered password
UserSchema.methods.matchEnteredPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

module.exports = mongoose.model('User', UserSchema);
