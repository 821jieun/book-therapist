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

router.get('/all', recController.getAllRecommendations);
router.post('/create', recController.createRecommendation);
router.put('/update/:id', recController.updateRecommendation);
router.delete('/delete/:id', recController.deleteRecommendation);

module.exports = router;
