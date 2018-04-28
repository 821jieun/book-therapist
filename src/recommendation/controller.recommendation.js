const recommendationModel = require('./model.recommendation');
const jwt = require('jsonwebtoken');

exports.verifyToken = (req, res, next) => {
  const token = req.headers.authorization || req.params.token;

  if (!token) {
    res.status(401).json({
      message: "no token provided"
    })
    return;
  }
  jwt.verify(token, process.env.JWT_SECRET, (err, decodedObj) => {
    if (err) {
      res.status(401).json({
        message: "token is not valid!"
      })
      return;
    }
    req.user = decodedObj;
    next();
  })
}

exports.getAllRecommendations = (req, res) => {
  recommendationModel
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
};

exports.getRecommendation = (req, res) => {
  recommendationModel
  .findById(req.params.id)
  .then(recommendation => res.json(recommendation.serialize()))
  .catch(err => {
    console.error(err);
    res.status(500).json({ message: 'Internal server error'})
  });
};

exports.createRecommendation = (req, res) => {
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
  recommendationModel
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
};


exports.updateRecommendation = (req, res) => {
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
  console.log(toUpdate, 'toupdate here!');
  updateableFields.forEach(field => {
    if (field in req.body) {
      toUpdate[field] = req.body[field];
    }
  });

  recommendationModel
    // all key/value pairs in toUpdate will be updated -- that's what `$set` does
    .findByIdAndUpdate(req.params.id, { $set: toUpdate })
    .then(recommendation => res.status(204).end())
    .catch(err => res.status(500).json({ message: 'Internal server error' }));
};
// exports.updateRecommendation = (req, res) => {
//   // ensure that the id in the request path and the one in request body match
//   console.log(req.body.id, 'req.body.id')
//   console.log(req.params.id, 'req.params.id')
//   if (!(req.params.id && req.body.id && req.params.id === req.body.id)) {
//     const message = (
//       `Request path id (${req.params.id}) and request body id ` +
//       `(${req.body.id}) must match`);
//     console.error(message);
//     return res.status(400).json({ message: message });
//   }
//
//   const toUpdate = {};
//   const updateableFields = ['title', 'description', 'bookId', 'author', 'image'];
// //check the db to see if this entry already has title/author/image/description filled
// //with something other than undefined or 'n/a'
// //if so, concatenate the req.body[field]
//   updateableFields.forEach(field => {
//     if (field in req.body) {
//       toUpdate[field] = req.body[field];
//     }
//   });
//   console.log(toUpdate, 'toUpdate here!')
//
//   recommendationModel
//     // all key/value pairs in toUpdate will be updated -- that's what `$set` does
//     .findByIdAndUpdate(req.params.id, { $push: toUpdate })
//     .then(recommendation => res.status(204).end())
//     .catch(err => res.status(500).json({ message: 'Internal server error' }));
// };

exports.deleteRecommendation = (req, res) => {
  recommendationModel
    .findByIdAndRemove(req.params.id)
    .then(recommendation => res.status(204).end())
    .catch(err => res.status(500).json({ message: 'Internal server error' }));
};
