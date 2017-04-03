var express = require('express');
var router = express.Router();
var ReviewController = require('../controllers/ReviewController');

// review routes
router.post('/writeReview', ReviewController.writeReview);
router.post('/upvoteReview', ReviewController.upvoteReview); //change to get
router.post('/downvoteReview', ReviewController.downvoteReview); //change to get
router.post('/viewReviews', ReviewController.viewReviews);
router.post('/replyReview', ReviewController.replyReview);

module.exports = router;
