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
  entryText: {
    type: String,
    required: true
  },
  bookId: {
    type: String
  },
  description: {
    type: String
  }
});

recommendationSchema.methods.serialize = function() {
  return {
    bookId: this.bookId || 'n/a',
    id: this._id,
    title: this.title || 'n/a',
    author: this.author || 'n/a',
    description: this.description || 'n/a',
    entryText: this.entryText
  };
}

const Recommendations = mongoose.model('Recommendation', recommendationSchema);

module.exports = {Recommendations};
