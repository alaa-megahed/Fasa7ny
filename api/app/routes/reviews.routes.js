var express = require('express');
var router = express.Router();
var ReviewController = require('../controllers/review.controller');

// review routes
router.post('/writeReview', ReviewController.writeReview);
router.post('/upvoteReview', ReviewController.upvoteReview); //change to get
router.post('/downvoteReview', ReviewController.downvoteReview); //change to get
router.post('/replyReview', ReviewController.replyReview);
router.post('/deleteReview', ReviewController.deleteReview);
router.post('/deleteReply', ReviewController.deleteReply);
module.exports = router;
