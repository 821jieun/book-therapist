'use strict';

const mongoose = require('mongoose');
mongoose.Promise = global.Promise;
// var Schema = mongoose.Schema;
const User = require('../user/model.user');

const  recommendationSchema = mongoose.Schema({
  publishDate: {
    type: Date,
    default: Date.now()
  },
  entryText: {
    type: String,
    required: true
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  books: []
});

recommendationSchema.methods.serialize = function() {
  // return {
  //   bookId: this.bookId || 'n/a',
  //   publishDate: this.publishDate || 'n/a',
  //   id: this._id,
  //   title: this.title || 'n/a',
  //   author: this.author || 'n/a',
  //   description: this.description || 'n/a',
  //   entryText: this.entryText,
  //   image: this.image || 'n/a',
  //   userId: this.userId
  // };
  return {
      id: this._id,
    publishDate: this.publishDate || 'n/a',
    entryText: this.entryText,
    userId: this.userId,
    books: this.books
  };
}


module.exports = mongoose.model('Recommendation', recommendationSchema);
