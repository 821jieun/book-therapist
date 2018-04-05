
const express = require('express');
const app = express();
const morgan = require('morgan');

app.use(morgan('common'));
app.use(express.static('browser'));
// app.get('/', (req, res) => {
//   res.sendFile(__dirname + '/browser/home.html');
// });

app.get('/api/recommendations', (req, res) => {
  // res.sendFile(__dirname + '/browser/home.html');
});
app.get('/api/login', (req, res) => {
  // res.sendFile(__dirname + '/browser/login.html');
});
app.post('/api/signup', (req, res) => {
  console.log('/api/signup:', req.body)

});

app.get('*', (req, res) => {
  res.json('not found');
});

let server;

function runServer() {
  const port = process.env.PORT || 8080;

  return new Promise((resolve, reject) => {
    server = app.listen(port, () => {
      console.log(`listening attentively on port ${port}`);
      resolve(server);
    }).on('error', err => {
      reject(err);
    });
  });
}

function closeServer() {
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
}

if (require.main === module) {
  runServer().catch(err => console.error(err));
};

module.exports = { app, runServer, closeServer};
