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
  },
  username: {
    type: String
  }
});

recommendationSchema.methods.serialize = function() {
  return {
    bookId: this.bookId || 'n/a',
    publishDate: this.publishDate || 'n/a',
    id: this._id,
    title: this.title || 'n/a',
    author: this.author || 'n/a',
    description: this.description || 'n/a',
    entryText: this.entryText,
    image: this.image || 'n/a',
    postedBy: this.postedBy || 'n/a',
    username: this.username || 'n/a'
  };
}


module.exports = mongoose.model('Recommendation', recommendationSchema);
