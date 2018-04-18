'use strict';

const mongoose = require('mongoose');
mongoose.Promise = global.Promise;

const  recommendationSchema = mongoose.Schema({
  title: {
    type: String
  },
  author: {
    type: String
  },
  publishDate: {
    type: Date,
    default: Date.now()
  },
  entryText: {
    type: String,
    required: true
  },
  bookId: {
    type: String
  },
  description: {
    type: String
  },
  image: {
    type: String
  }
});

recommendationSchema.methods.serialize = function() {
  return {
    bookId: this.bookId || '',
    publishDate: this.publishDate || '',
    id: this._id,
    title: this.title || '',
    author: this.author || '',
    description: this.description || '',
    entryText: this.entryText,
    image: this.image || ''
  };
}

const Recommendations = mongoose.model('Recommendation', recommendationSchema);

module.exports = {Recommendations};
