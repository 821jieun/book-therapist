const recommendationModel = require('./model.recommendation');
const jwt = require('jsonwebtoken');

exports.verifyToken = (req, res, next) => {
  const token = req.headers.authorization || req.params.token;

  if (!token) {
    res.status(401).json({
      message: 'no token provided'
    })
    return;
  }
  jwt.verify(token, process.env.JWT_SECRET, (err, decodedObj) => {
    if (err) {
      res.status(401).json({
        message: 'token is not valid!'
      })
      return;
    }
    req.user = decodedObj;
    next();
  })
}

exports.getAllRecommendations = (req, res) => {

  recommendationModel
    .find({
      userId: req.user.id})
    .populate('userId', 'username')
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

    if (!(field in req.body)) {
      const message = `missing ${field} in request body`
      console.error(message);
      return res.status(400).send(message)
    }
  }

  recommendationModel
    .create({
      entryText: req.body.entryText,
      userId: req.user.id
    })
    .then(recommendation => res.status(201).json(recommendation.serialize()))
    .catch(err => {
      console.error(err);
      res.status(500).json({ message: 'Internal server error'});
    });
};


exports.updateRecommendation = (req, res) => {
  // ensure that the id in the request path and the one in request body match
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

  recommendationModel
    .findByIdAndUpdate(req.params.id, { $set: toUpdate })
    .then(recommendation => res.status(204).end())
    .catch(err => res.status(500).json({ message: 'Internal server error' }));
};

exports.deleteRecommendation = (req, res) => {
  recommendationModel
    .findByIdAndRemove(req.params.id)
    .then(recommendation => res.status(204).end())
    .catch(err => res.status(500).json({ message: 'Internal server error' }));
};
