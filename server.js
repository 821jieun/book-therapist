'use strict';
const express = require('express');
const app = express();
const morgan = require('morgan');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

mongoose.Promise = global.Promise;
const {PORT, DATABASE_URL} = require('./config');
const { Recommendations } = require('./models/recommendations');

app.use(morgan('common'));
app.use(express.static('browser'));
app.use(bodyParser.urlencoded({
  extended: true
}));
app.use(bodyParser.json());

app.get('/', (req, res) => {
  res.sendFile(__dirname + '/browser/index.html');
});

app.get('/recommendations', (req, res) => {
  Recommendations
    .find()
    .then(recommendations => {

      res.json({
        recommendations: recommendations.map((recommendation) => {
          return recommendation.serialize();
        })
      })
    })
    .catch(err => {
      console.error(err);
      res.status(500).json({ message: 'Internal server error'});
    });
});

app.get('/recommendations/:id', (req, res) => {
  Recommendations
  .findById(req.params.id)
  .then(recommendation => res.json(recommendation.serialize()))
  .catch(err => {
    console.error(err);
    res.status(500).json({ message: 'Internal server error'})
  });
});

app.post('/recommendations', (req, res) => {
  const requiredFields = ['entryText'];
  for (let i = 0; i < requiredFields.length; i++) {
    const field = requiredFields[i];
    console.log(req.body, 'req here!! in post route')
    if (!(field in req.body)) {
      const message = `missing ${field} in request body`
      console.error(message);
      return res.status(400).send(message)
    }
  }
  Recommendations
    .create({
      // title: req.body.title,
      // author: req.body.author,
      entryText: req.body.entryText
      // description: req.body.description,
      // bookId: req.body.bookId
    })
    .then(recommendation => res.status(201).json(recommendation.serialize()))
    .catch(err => {
      console.error(err);
      res.status(500).json({ message: 'Internal server error'});
    });
});


app.put('/recommendations/:id', (req, res) => {
  // ensure that the id in the request path and the one in request body match
  console.log(req.body.id, 'req.body.id')
  console.log(req.params.id, 'req.params.id')
  if (!(req.params.id && req.body.id && req.params.id === req.body.id)) {
    const message = (
      `Request path id (${req.params.id}) and request body id ` +
      `(${req.body.id}) must match`);
    console.error(message);
    return res.status(400).json({ message: message });
  }

  const toUpdate = {};
  const updateableFields = ['title', 'description', 'bookId', 'author', 'image'];

  updateableFields.forEach(field => {
    if (field in req.body) {
      toUpdate[field] = req.body[field];
    }
  });

  Recommendations
    // all key/value pairs in toUpdate will be updated -- that's what `$set` does
    .findByIdAndUpdate(req.params.id, { $set: toUpdate })
    .then(recommendation => res.status(204).end())
    .catch(err => res.status(500).json({ message: 'Internal server error' }));
});

app.delete('/recommendations/:id', (req, res) => {
  Recommendations
    .findByIdAndRemove(req.params.id)
    .then(recommendation => res.status(204).end())
    .catch(err => res.status(500).json({ message: 'Internal server error' }));
});


app.use('*', function (req, res) {
  res.status(404).json({ message: 'Not Found' });
});

let server;

function runServer(databaseUrl = DATABASE_URL, port = PORT) {

  return new Promise((resolve, reject) => {
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

if (require.main === module) {
  runServer().catch(err => console.error(err));
};

module.exports = { app, runServer, closeServer};
