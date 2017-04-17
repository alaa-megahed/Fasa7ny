var mongoose = require('mongoose');
var Business = mongoose.model('Business');
var Review = mongoose.model('Review');
var RegisteredUser = mongoose.model('RegisteredUser');
var Reply = mongoose.model('Reply');
var WebAdmin = mongoose.model('WebAdmin');

/* a user can write a review about a certain business by creating the review
 then pushing this review to the array of reviews of the business*/
exports.writeReview = function(req, res) {

  if(req.user && req.user instanceof RegisteredUser && typeof req.body.review != "undefined"
  && req.body.review.length > 0 && typeof req.query.id != "undefined") {
    var businessId = req.query.id;
    var id = req.user.id;

    Business.findOne({_id:businessId}, function(err, business) {
      if(err) console.log("error in adding review to business");
      else if(business) {

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
}

/*A user can upvote a review about a business. Any user can upvote only once,
so when such user upvotes he will be added to the upvotes array of the review
and the upvotes will be incremented.
and also can change a downvote to upvote by removing the user from the downvotes
array and decrementing the array then add such user to the upvotes array and
the upvotes will be incremented*/
exports.upvoteReview = function(req, res) {

  if(req.user && req.user instanceof RegisteredUser && typeof req.query.review != "undefined") {
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
                  // review.downvotes.pull(id);

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
}

/*A user can downvote a review about a business. Any user can downvote only once,
so when such user downvotes he will be added to the downvotes array of the
review and the downvote will be incremented.
and also can change the upvote to downvote by removing the user from the
upvotes array and decrementing the array then add such user to the downvote
array and the downvotes will be incremented*/
exports.downvoteReview = function(req, res) {

  if(req.user && req.user instanceof RegisteredUser && typeof req.query.review != "undefined") {
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
}
/*view reviews of a certain business*/
exports.viewReviews = function(req, res) {
  if(req.query.id != "undefined") {
    var businessId = req.query.id;

    Review.find({business:businessId}, function(err, reviews) {
      if(err) {
        console.log("error in viewing the reviews");
      } else {
        console.log(reviews);
      }
    })
  }
}
/* A business or a RegisteredUser can reply to a review.
First, we must check if the user who is replying a business or a RegisteredUser
then add the reply to the replies array in the review */
exports.replyReview = function(req, res) {

  if(req.user && typeof req.body.reply != "undefined" && typeof req.query.id != "undefined") {
    var id = req.user.id;
    var r = req.body.reply;
    var reviewId = req.query.id;  //req.params.
    // var id = req.body.id;
    // var r = req.body.reply;
    // var reviewId = req.body.review;

    if(req.user instanceof Business) {
      var newReply = new Reply({
        reply:req.body.reply
      });
      newReply.business = business;
      newReply.review = reviewId;

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
    } else if(req.user instanceof RegisteredUser) {
      var newReply = new Reply({
        reply:req.body.reply
      });
      newReply.user = user;
      newReply.review = reviewId;

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
  }
}

/* A webadmin can delete a review if it is inappropriate. So first we must
if he is a webadmin because otherwise the review cannot be deleted.
When the review is deleted, all the replies must be deleted as well as the
review will be removed from the reviews array at the business */
exports.deleteInappropriateReview = function(req, res) {

  if(req.user && req.user instanceof WebAdmin && req.query.review != "undefined") {
    var id = req.user.id; //WebAdmin's ID
    var r = req.query.review;
    // var id = req.body.id;
    // var r = req.body.review;

    Review.remove({_id:r}, function(err) {
      if(err) console.log("error in deleting the review");
      else {
        console.log("review deleted");
        Reply.remove({review:r}, function(err) {
          if(err) console.log("error in deleting the replies of the review");
          else {
            console.log("reply deleted");

            Business.findByIdAndUpdate({_id:reviews.business}, {$pull:{reviews:r}},
            function(err,updatedBusiness) {
              if(err) console.log("error in removing the review from the business' reviews array");
              else {
                console.log("business updated");
                console.log(updatedBusiness);
              }
            });
          }
        });
      }
    });
  }
}

























//
