'use strict';

const bcrypt = require('bcrypt');
const mongoose = require('mongoose');
const BookRecs = require('../recommendation/model.recommendation');

mongoose.Promise = global.Promise;

const UserSchema = mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true
  },
  password: {
    type: String,
    required: true
  },
  firstName: {type: String, default: ''},
  lastName: {type: String, default: ''}
});


module.exports = mongoose.model('User', UserSchema);
