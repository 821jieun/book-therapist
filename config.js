'use strict';

exports.DATABASE_URL = process.env.DATABASE_URL || 'mongodb://localhost/book-therapist';
exports.TEST_DATABASE_URL = process.env.TEST_DATABASE_URL || 'mongodb://localhost/test-book-therapist';
exports.PORT = process.env.PORT || 8080;
exports.JWT_SECRET = process.env.JWT_SECRET || 'sour_cherry_pie';
exports.JWT_EXPIRY = process.env.JWT_EXPIRY || '7d';
