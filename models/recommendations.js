'use strict';

const mongoose = require('mongoose');
mongoose.Promise = global.Promise;

const  recommendationSchema = mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  author: {
    type: String,
    required: true
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
    bookId: this.bookId,
    id: this._id,
    title: this.title,
    author: this.author,
    description: this.description,
    entryText: this.entryText
  };
}

const RecList = mongoose.model('Recommendation', recommendationSchema);

module.exports = {RecList};
