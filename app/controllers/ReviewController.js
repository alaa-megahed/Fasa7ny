var mongoose = require('mongoose');
var Business = mongoose.model('Business');
var Review = mongoose.model('Review');
var RegisteredUser = mongoose.model('RegisteredUser');
var Reply = mongoose.model('Reply');

exports.writeReview = function(req, res) {
  var businessId = req.query.id;
  var id = req.user.id;

  // var businessId = req.body.Bid;
  // var id = req.body.id;

  var newReview = new Review({
    review : req.body.review,
    upvote : 0,
    downvote : 0
  });
  newReview.business = businessId;
  newReview.user = id;

  newReview.save(function(err, review) {
    if(err) {
      console.log("cannot save review");
    } else {
      console.log(review);

      Business.findOne({_id:businessId}, function(err, business) {
        if(err) {
          console.log("error in adding review to business");
        } else {
          console.log(business);
          console.log(business.reviews);
          business.reviews.push(review);

          business.save(function(err, updatedbusiness) {
            if(err) {
              console.log("could not update the business's review");
            } else {
              console.log(updatedbusiness);
              res.send(updatedbusiness);
              //redirect to the review page and his review should be displayed
            }
          });
        }
      });
    }
  });
}

exports.upvoteReview = function(req, res) {
  var rev = req.query.review;
  var id = req.user.id;
  // var id = req.body.id;
  // var rev = req.body.review;

  Review.findOne({_id: rev}, function(err, review) {
    if(err) {
      console.log("cannot find review to be upvoted");
    } else {
      var flag = true;
      for(var i = 0; i < review.upvotes.length; i++) {
        if(review.upvotes[i] == id) flag = false;
      }

      if(flag == true) {
        // review.upvotes.push(id);

        Review.findByIdAndUpdate(rev, {$push: {"upvotes" : id}},{safe:true, upsert: true, new:true},
        function(err, newrev) {
          if(err) {
            console.log("error in upvoting the review");
          } else {
            console.log("upvoted1");
          }
        });

        Review.findByIdAndUpdate(rev, {$set: {upvote: review.upvote+1}},
          function(err, updatedReview) {
            if(err) {
              console.log("error in upvoting");
            } else {
              console.log("upvoted2");
              console.log(updatedReview);

              for(var i = 0; i < review.downvotes.length; i++) {
                if(review.downvotes[i] == id){
                  flag = false;
                }
              }

              if(flag == false) {
                review.downvotes.pull(id);

                Review.findByIdAndUpdate(rev, {$pull: {"downvotes" : id}},{safe:true, upsert: true, new:true},
                function(err, newreview) {
                  if(err) {
                    console.log("error in updating downvotes array");
                  } else {
                    console.log("upvotes array updated");
                  }
                });

                Review.findByIdAndUpdate(rev, {$set: {downvote: review.downvote-1}},
                  function(err, updatedReview) {
                    if(err) {
                      console.log("error in decrementing downvotes");
                    } else {
                      console.log("downvotes decremented");
                      console.log(updatedReview);
                    }
                });
              }
            }
        });

      } else {
        console.log("cannot vote more than once");
      }
    }
  })
}

exports.downvoteReview = function(req, res) {
  var rev = req.query.review;
  var id = req.user.id;
  // var rev = req.body.review;
  // var id = req.body.id;

  Review.findOne({_id: rev}, function(err, review) {
    if(err) {
      console.log("cannot find review to be downvoted");
    } else {
      var flag = true;
      for(var i = 0; i < review.downvotes.length; i++) {
        if(review.downvotes[i] == id) flag = false;
      }

      if(flag == true) {
        // review.downvotes.push(id);

        Review.findByIdAndUpdate(rev, {$push: {"downvotes" : id}},{safe:true, upsert: true, new:true},
        function(err, newrev) {
          if(err) {
            console.log("error in downvoting the review");
          } else {
            console.log("downvoted1");
          }
        });

        Review.findByIdAndUpdate(rev, {$set: {downvote: review.downvote+1}},
          function(err, updatedReview) {
            if(err) {
              console.log("error in downvoting");
            } else {
              console.log("downvoted");
              console.log(updatedReview);

              for(var i = 0; i < review.upvotes.length; i++) {
                if(review.upvotes[i] == id){
                  flag = false;
                }
              }

              if(flag == false) {
                // review.upvotes.pull(id);

                Review.findByIdAndUpdate(rev, {$pull: {"upvotes" : id}},{safe:true, upsert: true, new:true},
                function(err, newreview) {
                  if(err) {
                    console.log("error in updating upvotes in the review");
                  } else {
                    console.log("upvotes array updated");
                  }
                });

                Review.findByIdAndUpdate(rev, {$set: {upvote: review.upvote-1}},
                  function(err, updatedReview) {
                    if(err) {
                      console.log("error in decrementing upvotes");
                    } else {
                      console.log("upvotes decremented");
                      console.log(updatedReview);
                    }
                });
              }
            }
        });
      } else {
        console.log("cannot vote more than once");
      }
    }
  })
}

exports.viewReviews = function(req, res) {
  var businessId = req.user.id;
  // var businessId = req.body.id;

  Review.find({business:businessId}, function(err, reviews) {
    if(err) {
      console.log("error in viewing the reviews");
    } else {
      console.log(reviews);
    }
  })
}

exports.replyReview = function(req, res) {
  var id = req.user.id;
  var r = req.body.reply;
  var reviewId = req.query.id;  //req.params.
  // var id = req.body.id;
  // var r = req.body.reply;
  // var reviewId = req.body.review;

  Business.findOne({_id:id}, function(err, business) {
    if(err) {
      console.log("cannot find business");
    } else {
      if(business == null) {
        RegisteredUser.findOne({_id:id}, function(err, user) {
          if(err) {
            console.log("cannot find RegisteredUser");
          } else {
            var newReply = new Reply({
              reply:req.body.reply
            });
            newReply.user = user;

            newReply.save(function(err, reply) {
              if(err) {
                console.log("cannot save reply");
              } else {
                Review.findByIdAndUpdate(reviewId, {$push: {"replies" : reply}},{safe:true, upsert: true, new:true},
                function(err, review) {
                  if(err) {
                    console.log("error in updating replies in the review");
                  } else {
                    console.log("reply by user added to the review");
                  }
                });
              }
            });
          }
        });
      } else {
        Business.findOne({_id:id}, function(err, business) {
          if(err) {
            console.log("cannot find business");
          } else {
            var newReply = new Reply({
              reply:req.body.reply
            });
            newReply.business = business;

            newReply.save(function(err, reply) {
              if(err) {
                console.log("cannot save reply");
              } else {
                Review.findByIdAndUpdate(reviewId, {$push: {"replies" : reply}},{safe:true, upsert: true, new:true},
                function(err, review) {
                  if(err) {
                    console.log("error in updating replies in the review");
                  } else {
                    console.log("reply by business added to the review");
                  }
                });
              }
            });
          }
        });
      }
    }
  });
}

























//
