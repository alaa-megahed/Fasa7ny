var express = require('express');
var router = express.Router();
var ReviewController = require('../controllers/review.controller');

// review routes
router.post('/writeReview', ReviewController.writeReview);
router.get('/upvoteReview', ReviewController.upvoteReview); //change to get
router.get('/downvoteReview', ReviewController.downvoteReview); //change to get
router.get('/viewReviews', ReviewController.viewReviews);
router.post('/replyReview', ReviewController.replyReview);
router.get('/deleteReview', ReviewController.deleteInappropriateReview);

module.exports = router;
