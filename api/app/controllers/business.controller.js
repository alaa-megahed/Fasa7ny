var Business = require('../models/Business');
var Events = require('mongoose').model('Events');
var EventOccurrences = require('mongoose').model('EventOccurrences');
var Rating = require('mongoose').model('Rating');
var Facility = require('mongoose').model('Facility');
var User = require('mongoose').model('RegisteredUser');

var BusinessController = {
  getBusiness: function (req, res) {
   // var name = "Habiiba";
   // var name = "Escape Room";
   console.log("backend");
   if(req.params.id && req.user && req.user instanceof User) {
      //  var name = req.params.name;
      var id = req.params.id;
       Business.findOne({_id: id }).
           exec(function (err, result) {
               if (err)
                   return res.status(500).json("Something went wrong");
               else {
                 console.log("result");
                 if(!result) return res.status(500).json("Business does not exist");
                   Rating.findOne({user_ID: req.user.id , business_ID: result._id}, function(err, rate) {
                     if(err) res.status(500).json("Something went wrong");
                     else {
                       var r = 0;
                       if(rate) r = rate.rating;
                       Facility.find({business_id:result._id}, function(err, facilities) {
                           if(err) res.status(500).json("Something went wrong");
                           else {
                             Events.find({business_id:result._id, repeated:"Once"}, function(err, onceevents) {
                                   if(err) res.status(500).json("Something went wrong");
                                   if(!onceevents) res.status(200).json({result:result,
                                           rate:r, facilities:facilities, events:[]});
                                   else {
                                     console.log("done!!");
                                       res.status(200).json({result:result,
                                           rate:r, facilities:facilities, events:onceevents});
                                   }
                               });
                           }
                       });
                     }
                   })
                 }
           });
   } else if(req.params.id) {
     var id = req.params.id;
     Business.findOne({_id: id }).
         exec(function (err, result) {
             if (err)
                 return res.status(500).json("Something went wrong");
             else {
               console.log("??");
               if(!result) return res.status(500).json("Business does not exist");
                     Facility.find({business_id:result._id}, function(err, facilities) {
                         if(err) res.status(500).json("Something went wrong");
                         else {
                           Events.find({business_id:result._id, repeated:"Once"}, function(err, onceevents) {
                                 if(err) res.status(500).json("Something went wrong");
                                 if(!onceevents) res.status(200).json({result:result,
                                         facilities:facilities, events:[]});
                                 else {
                                     res.status(200).json({result:result,
                                         facilities:facilities, events:onceevents});
                                 }
                             });
                         }
                     });
                   }
                 })
               } else res.status(500).json("Error");
             },

    /* A business can request to be removed from the website.
    If the business has any bookings the request is rejected and a message is sent to the business specifying
    that the request was cancelled and that the business should cancel its bookings first.*/


requestRemoval: function(req,res) {
        if(req.user && req.user instanceof Business){
        var id = req.user.id;
        console.log('removal');

        Business.findByIdAndUpdate(id,{$set:{delete:1}}, function(err,business){
            if(err) res.status(500).json("Something went wrong");
            else {
                res.status(200).json("Requested!");
                }
        });

        }

        else{
         res.status(500).json('You are not a logged in busiess');
     }

    },

    /* A business can make his own page public (by changing the public flag)
    so that Business will now show up in searches and can be viewed by all users.*/
    makePagePublic: function (req, res) {
        if (req.user && req.user instanceof Business) {
            var businessId = req.user.id;
            console.log('public');

            Business.findByIdAndUpdate(businessId, { $set: { public: 1 } },
                function (err) {
                    if (err) {
                        res.status(500).json("Something went wrong");
                    } else {
                        res.status(200).json("done");
                    }
                });
        } else res.status(500).json("you must be a logged in business");
    },

    /* A business can edit its personal infromation.*/


    editInformation: function (req, res) {

        if (req.user && req.user instanceof Business) {
            var id = req.user.id;
            console.log("ana fl backend");
            console.log(req.body);
            Business.findById(id, function (err, business) {
                if (err) res.status(500).json("Something went wrong");
                else if (!business) res.status(500).json("Business not found");
                else {
                    if (typeof req.body.description != "undefined" && req.body.description.length > 0) {
                        business.description = req.body.description;
                    }

                    if (typeof req.body.location != "undefined" && req.body.location.length > 0) {
                        business.location = req.body.location;
                    }
                    if (typeof req.body.email != "undefined" && req.body.email.length > 0) {
                        business.email = req.body.email;
                    }

                    if (typeof req.body.address != "undefined" && req.body.address.length > 0) {
                        business.address = req.body.address;
                    }
                    if (req.body.area) {
                        business.area = req.body.area;
                    }
                    if (typeof req.body.phones != "undefined" && req.body.phones.length > 0) {
                        var found = false;
                        //check if phone already added
                        for (var i = 0; i < business.phones.length; i++) {
                            if (business.phones[i] == req.body.phones) {
                                found = true;
                                break;
                            }
                        }
                        if (!found)
                            business.phones.push(req.body.phones);
                    }
                    if (typeof req.body.payment_methods != "undefined" && req.body.payment_methods.length > 0) {
                        business.payment_methods.push(req.body.payment_methods);
                    }

                    if(typeof req.file != "undefined") {
                      business.images.push(req.file.filename);
                    }

                    if(typeof req.body.password != "undefined" && req.body.password > 0) {
                      business.password = business.generateHash(req.body.password);
                    }

                    if(req.body.facebookURL) {
                      console.log(req.body.facebookURL);
                      business.facebookURL = req.body.facebookURL;
                    }

                    if(req.body.twitterURL) {
                      business.twitterURL = req.body.twitterURL;
                    }

                    if(req.body.youtubeURL) {
                      business.youtubeURL = req.body.youtubeURL;
                    }

                    business.save(function(err, newbusiness) {
                      res.status(200).json({business:newbusiness});
                    });
                    // res.sendFile('/business/b');

                }

            });

        }

        else {
            res.status(500).json('You are not a logged in business');
        }
    },

    /* A business can request to delete a phone number. If this is business' only phone number then it will
    not be deleted and the business will receive a message. If the business has other phone numbers then this
    one can be deleted. If the business entered a wrong phone number a message is sent to the business
    saying that the phone number was not found.*/
    deletePhone: function (req, res) {
        if (req.user && req.user instanceof Business) {
            if (typeof req.params.phone != "undefined") {
                var id = req.user.id;
                console.log("ana fl backend delete phone");
                var phone = req.params.phone;
                Business.findOne({ _id: id }, function (err, business) {
                    if (err) res.status(500).json("Something went wrong");
                    else if (!business) res.status(500).json("Something went wrong");
                    else {
                        if (business.phones.length < 2)
                            res.status(500).json('Must have at least one phone number');
                        else {
                            var check = 0;
                            for (var i = 0; i < business.phones.length && check == 0; i++) {

                                if (business.phones[i] == phone) {
                                    check = 1;
                                }
                            }
                            if (check) {
                                Business.findByIdAndUpdate(id, { $pull: { "phones": phone } }, function (err, info) {
                                    if (err) res.status(500).json("Something went wrong");
                                    if (!info) res.status(500).json("Something went wrong");
                                    else{ res.status(200).json('phone deleted'); console.log("phone deleted");}
                                });
                            }
                            else {
                                res.status(500).json('Phone not found!')
                            }

                        }

                    }

                });
            }
            else res.status(500).json("Enter a phone number");
        }

        else {
          res.status(500).json('You are not a logged in business');
        }

    },

    /* A business can request to delete a payment method. If this is business' only payment method then it will
    not be deleted and the business will receive a message. If the business has other payment methods then this
    one can be deleted. If the business entered a wrong payment method a message is sent to the business
    saying that the payment method was not found.*/

    deletePaymentMethod: function (req, res) {
        if (req.user && req.user instanceof Business) {
            if (typeof req.params.method != "undefined") {
                var id = req.user.id;

                var payment = req.params.method;
                console.log("ana fl backend delete method");
                Business.findOne({ _id: id }, function (err, business) {
                    if (err) res.status(500).json("Something went wrong");
                    else if (!business) res.status(500).json("Something went wrong");
                    else {
                        if (business.payment_methods.length < 2)
                            res.status(500).json('Must have at least one payment method');
                        else {
                            var check = 0;
                            for (var i = 0; i < business.payment_methods.length && check == 0; i++) {

                                if (business.payment_methods[i] == payment) {
                                    check = 1;
                                }
                            }

                            if (check) {
                                Business.findByIdAndUpdate(id, { $pull: { "payment_methods": payment } }, function (err, info) {
                                    if (err) res.status(500).json("Something went wrong");
                                    if (!info) res.status(500).json("Something went wrong");
                                    else {res.status(200).json('payment method deleted'); console.log("payment method deleted");}
                                });

                            }
                            else {
                                res.status(500).json('Payment Method not found!');
                            }

                        }
                    }
                });

            }
            else {
                res.status(500).json('Enter a payment method to be deleted');
            }
        }
        else {
          res.status(500).json('You are not a logged in business');
        }

    },

    deleteImage: function(req, res) {
      if(req.user && req.user instanceof Business) {
        var id = req.user.id;
        // var id = "58f8b9fdf3e7ca15c2ca2c1f";
        // var id = "58f879e533a8465ada041bd1";
        console.log("ana fl backend delete image");
        var image = req.params.image;

        Business.findByIdAndUpdate(id, {$pull: {"images" : image}},{safe:true, upsert: true, new:true},
        function(err, newBusiness) {
          if(err) {
            console.log("error in deleting image");
            res.status(500).json("Something went wrong");
          } else {
            console.log("image deleted");
            console.log(newBusiness);
          }
        });
      } else res.status(500).json("You are not a logged in business");
    },


    changeProfilePicture: function(req, res) {

      if(req.user && req.user instanceof Business) {
        // var id = "58f8b9fdf3e7ca15c2ca2c1f";
        var id = req.user.id;

        console.log("ana fl backend changeProfilePicture");
        var file = req.file;

        Business.findByIdAndUpdate(id, {$set:{profilePicture:file.filename}}, function(err, updatedBusiness) {
            if(err) res.status(500).json("error in changing the profile picture");
            else res.status(200).json({business:updatedBusiness});
        });
    }
  }
}


module.exports = BusinessController;
