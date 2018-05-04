const express = require('express');
const router = express.Router();
const recController = require('./controller.recommendation.js');

router.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
  res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type,Authorization');
  res.setHeader('Access-Control-Allow-Credentials', true);
  next();
});

router.get('/all/:token', recController.verifyToken, recController.getAllRecommendations);
router.post('/create/:token', recController.verifyToken, recController.createRecommendation);
router.put('/update/:id/:token', recController.verifyToken, recController.addABookToRecommendation);
router.delete('/delete/:id/:token', recController.verifyToken, recController.deleteRecommendation);
router.delete('/delete/singlebook/:id/:bookId/:token', recController.verifyToken, recController.deleteSingleBook);
module.exports = router;
