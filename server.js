'use strict';
const express = require('express');
const app = express();
const morgan = require('morgan');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const dotenv = require('dotenv');

mongoose.Promise = global.Promise;
const {PORT, MONGOLAB_URI} = require('./config');
console.log(MONGOLAB_URI, 'mongolab uri here')
const recRoutes = require('./src/recommendation/routes.recommendation');
const userRoutes = require('./src/user/routes.user');

dotenv.config({path: './.env'});

app.use(morgan('common'));
app.use(express.static('browser'));
app.use(bodyParser.urlencoded({
  extended: true
}));
app.use(bodyParser.json());

app.use(express.static('public'));


let server;

function runServer(databaseUrl = MONGOLAB_URI, port = PORT) {

  return new Promise((resolve, reject) => {
    // mongoose.connect(databaseUrl, err => {
    mongoose.connect(databaseUrl, err => {
      console.log(databaseUrl, 'database here')
      if (err) {
        return reject(err);
      }

      server = app.listen(port, () => {
        console.log(`listening attentively on port ${port}`);
        resolve(server);
      }).on('error', err => {
        reject(err);
      });
    });
  });
}

function closeServer() {
  return mongoose.disconnect().then(() => {
    return new Promise((resolve, reject) => {
      console.log('Closing server');
      server.close(err => {
        if (err) {
          reject(err);
          return;
        }
        resolve();
      });
    });
  });
}



app.use('/recommendations', recRoutes);
app.use('/user', userRoutes);

app.use('*', function (req, res) {
  res.status(404).json({ message: 'Not Found' });
});

if (require.main === module) {
  runServer().catch(err => console.error(err));
};

module.exports = { app, runServer, closeServer};
