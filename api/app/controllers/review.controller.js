var mongoose = require('mongoose');
var Business = mongoose.model('Business');
var Review = mongoose.model('Review');
var RegisteredUser = mongoose.model('RegisteredUser');
var Reply = mongoose.model('Reply');
var WebAdmin = mongoose.model('WebAdmin');

/* a user can write a review about a certain business by creating the review
 then pushing this review to the array of reviews of the business*/
exports.writeReview = function (req, res) {

  // if(req.user && req.user instanceof RegisteredUser && typeof req.body.review != "undefined"
  // && req.body.review.length > 0 && typeof req.query.id != "undefined") {

  //getting the user ID and business ID as input to the POST request from angular 


  if (typeof req.body.review != 'undefined' && req.body.review.length > 0 && req.body.userID != null) {
    var businessId = req.body.businessID;
    var id = req.body.userID;

    Business.findOne({ _id: businessId }, function (err, business) {
      if (err) console.log(err);
      else if (business) {
        RegisteredUser.findById(id, function (err, user) {
          if (err)
            console.log(err);
          else {
            var newReview = new Review({
              review: req.body.review,
              upvote: 0,
              downvote: 0
            });
            newReview.business = businessId;
            newReview.user = user;
            business.reviews.push(newReview);
            business.save(function (err, updatedBusiness) {
              if (err) {
                console.log(err);
              } else {
                res.json(updatedBusiness);
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
exports.upvoteReview = function (req, res) {

  if (req.user && req.user instanceof RegisteredUser && typeof req.query.review != "undefined") {
    var rev = req.query.review;
    var id = req.user.id;
    // var id = req.body.id;
    // var rev = req.body.review;

    Review.findOne({ _id: rev }, function (err, review) {
      if (err) {
        console.log("cannot find review to be upvoted");
      } else {
        var flag = true;
        for (var i = 0; i < review.upvotes.length; i++) {
          if (review.upvotes[i] == id) flag = false;
        }

        if (flag == true) {
          // review.upvotes.push(id);

          Review.findByIdAndUpdate(rev, { $push: { "upvotes": id } }, { safe: true, upsert: true, new: true },
            function (err, newrev) {
              if (err) {
                console.log("error in upvoting the review");
              } else {
                console.log("upvoted1");
              }
            });

          Review.findByIdAndUpdate(rev, { $set: { upvote: review.upvote + 1 } },
            function (err, updatedReview) {
              if (err) {
                console.log("error in upvoting");
              } else {
                console.log("upvoted2");
                console.log(updatedReview);

                for (var i = 0; i < review.downvotes.length; i++) {
                  if (review.downvotes[i] == id) {
                    flag = false;
                  }
                }

                if (flag == false) {
                  // review.downvotes.pull(id);

                  Review.findByIdAndUpdate(rev, { $pull: { "downvotes": id } }, { safe: true, upsert: true, new: true },
                    function (err, newreview) {
                      if (err) {
                        console.log("error in updating downvotes array");
                      } else {
                        console.log("upvotes array updated");
                      }
                    });

                  Review.findByIdAndUpdate(rev, { $set: { downvote: review.downvote - 1 } },
                    function (err, updatedReview) {
                      if (err) {
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
exports.downvoteReview = function (req, res) {

  if (req.user && req.user instanceof RegisteredUser && typeof req.query.review != "undefined") {
    var rev = req.query.review;
    var id = req.user.id;
    // var rev = req.body.review;
    // var id = req.body.id;

    Review.findOne({ _id: rev }, function (err, review) {
      if (err) {
        console.log("cannot find review to be downvoted");
      } else {
        var flag = true;
        for (var i = 0; i < review.downvotes.length; i++) {
          if (review.downvotes[i] == id) flag = false;
        }

        if (flag == true) {
          // review.downvotes.push(id);

          Review.findByIdAndUpdate(rev, { $push: { "downvotes": id } }, { safe: true, upsert: true, new: true },
            function (err, newrev) {
              if (err) {
                console.log("error in downvoting the review");
              } else {
                console.log("downvoted1");
              }
            });

          Review.findByIdAndUpdate(rev, { $set: { downvote: review.downvote + 1 } },
            function (err, updatedReview) {
              if (err) {
                console.log("error in downvoting");
              } else {
                console.log("downvoted");
                console.log(updatedReview);

                for (var i = 0; i < review.upvotes.length; i++) {
                  if (review.upvotes[i] == id) {
                    flag = false;
                  }
                }

                if (flag == false) {
                  // review.upvotes.pull(id);

                  Review.findByIdAndUpdate(rev, { $pull: { "upvotes": id } }, { safe: true, upsert: true, new: true },
                    function (err, newreview) {
                      if (err) {
                        console.log("error in updating upvotes in the review");
                      } else {
                        console.log("upvotes array updated");
                      }
                    });

                  Review.findByIdAndUpdate(rev, { $set: { upvote: review.upvote - 1 } },
                    function (err, updatedReview) {
                      if (err) {
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
exports.viewReviews = function (req, res) {
  if (req.query.id != "undefined") {
    var businessId = req.query.id;

    Review.find({ business: businessId }, function (err, reviews) {
      if (err) {
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
exports.replyReview = function (req, res) {
  var userID = req.body.userID;
  var businessID = req.body.businessID;
  var reply = req.body.reply;

  // if (req.user && typeof req.body.reply != "undefined" && typeof req.query.id != "undefined") {
  if (typeof reply != 'undefined' && req.body.reply.length > 0 && userID != null && businessID != null) {

    // var id = req.user.id;
    // var r = req.body.reply;
    // var reviewId = req.query.id;  //req.params.
    Business.findById(businessID, function (err, business) {
      if (err)
        console.log(err);
      else {
        
      }
    })

  }
}

/* A webadmin can delete a review if it is inappropriate. So first we must
if he is a webadmin because otherwise the review cannot be deleted.
When the review is deleted, all the replies must be deleted as well as the
review will be removed from the reviews array at the business */
exports.deleteReview = function (req, res) {
  var userID = req.body.userID
  var reviewUser = req.body.review.user._id;
  var businessID = req.body.businessID;
  var reviewID = req.body.review._id;
  var businessID = req.body.businessID;
  // if (req.user && req.user instanceof WebAdmin && req.query.review != "undefined") {
  if (userID == reviewUser) {
    // var id = req.user.id; //WebAdmin's ID
    // var r = req.query.review;
    Business.findById(businessID, function (err, business) {
      if (err)
        console.log(err);
      else {
        console.log(business);
        business.reviews.id(reviewID).remove();
        business.save(function (err, updatedBusiness) {
          if (err)
            console.log(err);
          else
            res.json(updatedBusiness);
        });
      }

    });
  }
}

























//
