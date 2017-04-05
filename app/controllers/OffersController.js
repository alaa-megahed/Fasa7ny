var mongoose = require('mongoose');
var Business = mongoose.model('Business');
var Offer = mongoose.model('Offer');


/* this function views all the offers created by a business by finding the offers
 having the same id as the id of the business passed to the function. */
exports.viewOffers = function(req, res) {
  var id = req.query.id;

  // var id = req.body.id; //only for testing
  Offer.find({business:id}, function(err, offers) {
    if(err) {
      console.log("error in finding all offers");
    } else {
      console.log("offers:");
      console.log(offers);
    }
  })
};

/*this function is used by business to create an offer where he must enter
the name, type, value, details and expiration date.
if the business added an expiration_date that is before the start_date(which if
 he did not enter it will be by default the current date when he created the offer)
 he will be notified that he entered a wrong expiration_date */
exports.createOffer = function(req, res) {
  if(req.user && req.user instanceof Business) {
    // var businessId = req.user.id;  //get _id from session
    var businessId =req.body.id;
    var s = req.body;
    var f = req.file;

    if(!s.name || !s.type || !s.value || !s.details || !s.expiration_date) {
      console.log("please add all information");
      res.send("please add all information");
      //send back to add offer page
    } else {
      var newOffer = new Offer({
        name:s.name,
        type:s.type,
        value:s.value,
        details:s.details,
        // start_date:s.start_date,
        expiration_date:new Date(s.expiration_date)
      });
      // newOffer.business = businessId;
      newOffer.business = s.id; //only for testing

      if(typeof f != 'undefined') {
        newOffer.image = f.filename;
      }
      if(typeof s.notify_subscribers != 'undefined') {
        newOffer.notify_subscribers = s.notify_subscribers;
      }
      if(typeof s.start_date != 'undefined') {
        newOffer.start_date = new Date(s.start_date);
      } else {
        newOffer.start_date = new Date();
      }
      var d1 = newOffer.start_date;
      var d2 = newOffer.expiration_date;
      // console.log(d1);
      // console.log(d2);
      if(d1 - d2 >= 0) {
        console.log("please add a valid expiration_date");
      } else {
        newOffer.save(function(err, offer) {
          if(err) {
            console.log("error in creating offer");
            res.send("error in creating offer");
            //send back to add offer page
          } else {
            console.log(offer);
            console.log("offer created successfully");
            res.send(offer);
            // res.send("offer created successfully");
            //send to profile/next page
          }
        })
      }
    }
  }
};

/* this function is used by the business to update the offers either by
changing its name, type, value, details, start date, expiration_date, image
or the notify_subscribers flag.
if the updated expiration date is before the start date then an error will be
displayed */
exports.updateOffer = function(req, res) {

  if(req.user && req.user instanceof Business) {
    var s = req.body;
    var businessId = req.user.id; //session
    // var businessId = req.body.business; //only for testing
    var id = req.query.id;
    // var id = s.id; //only for testing
    var f = req.file;
    // res.send(s);

    if(typeof s.name != 'undefined' && s.name.length != 0) {
      Offer.findByIdAndUpdate(
        id,
        {$set:{name:s.name}},
        function(err, offer) {
          if(err){
            console.log("error in updating name");
            // res.send("error in updating type");
          }
          else {
            console.log("name updated");
            console.log(offer);
            // res.send(offer);
          }
        }
      )
    }

    if(typeof s.type != 'undefined' && s.type.length != 0) {
      Offer.findByIdAndUpdate(
        id,
        {$set:{type:s.type}},
        function(err, offer) {
          if(err){
            console.log("error in updating type");
            // res.send("error in updating type");
          }
          else {
            console.log("type updated");
            console.log(offer);
            // res.send(offer);
          }
        }
      )
    }

    if(typeof s.value != 'undefined' && s.value.length != 0) {
      Offer.findByIdAndUpdate(
        id,
        {$set:{value:s.value}},
        function(err, offer) {
          if(err){
            console.log("error in updating value");
            // res.send("error in updating value")
          }
          else {
            console.log("value updated");
            console.log(offer);
            // res.send(offer);
          }
        }
      )
    }

    if(typeof s.details != 'undefined' && s.details.length != 0) {
      Offer.findByIdAndUpdate(
        id,
        {$set:{details:s.details}},
        function(err, offer) {
          if(err){
            console.log("error in updating details");
            // res.send("error in updating details");
          }
          else {
            console.log("details updated");
            console.log(offer);
            // res.send(offer);
          }
        }
      )
    }

    if(typeof s.start_date != 'undefined' && s.start_date.length != 0) {
      Offer.findByIdAndUpdate(
        id,
        {$set:{start_date:s.start_date}},
        function(err, offer) {
          if(err){
            console.log("error in updating start_date");
            // res.send("error in updating start_date");
          }
          else {
            console.log("start_date updated");
            console.log(offer);
            // res.send(offer);
          }
        }
      )
    }

    if(typeof s.expiration_date != 'undefined' && s.expiration_date.length != 0) {

      Offer.findOne({_id:id}, function(err, offer1) {
        if(err) console.log("error in finding offer for updating the expiration_date");
        else {
          var d1 = offer1.start_date;
          var d2 = new Date(s.expiration_date);
          console.log(d1);
          console.log(d2);
          console.log(d1-d2);
          if(d1 - d2 > 0) {
            console.log("please add a valid expiration_date");
          } else {
            Offer.findByIdAndUpdate(
              id,
              {$set:{expiration_date:s.expiration_date}},
              function(err, offer) {
                if(err) {
                  console.log("error in updating expiration_date");
                  console.log(offer);
                  console.log(s.expiration_date);
                  // res.send("error in updating expiration_date");
                }
                else {
                  console.log("expiration_date updated");
                  console.log(offer);
                  // res.send("offer");
                }
              });
          }
        }
      });
    }

    if(typeof s.notify_subscribers != 'undefined' && s.notify_subscribers.length != 0) {
      Offer.findByIdAndUpdate(
        id,
        {$set:{notify_subscribers:s.notify_subscribers}},
        function(err, offer) {
          if(err){
            console.log("error in updating notify_subscribers");
            // res.send("error in updating notify_subscribers");
          }
          else {
            console.log("notify_subscribers updated");
            console.log(offer);
            // res.send(offer);
          }
        }
      )
    }

    if(typeof f != 'undefined') {
      Offer.findByIdAndUpdate(
        id,
        {$set:{image:f.filename}},
        function(err, offer) {
          if(err){
            console.log("error in updating image");
            // res.send("error in updating image");
          }
          else {
            console.log("image updated");
            console.log(offer);
            // res.send(offer);
          }
        }
      )
    }

    Offer.findOne({_id:id}, function(err, offer) {
      if(err) {
        console.log("error in finding offer");
        res.send("error in finding offer");
      } else {
        console.log(offer);
        res.send(offer);
      }
    })
  }
};
/* */
exports.deleteOffer = function(req, res) {
  if(req.user && req.user instanceof Business) {
    var id = req.query.id;
    var businessId = req.user.id;
    // var businessId = req.query.Bid; //just for testing
    var d = new Date();
    Offer.findOne({_id:id}, function(err, offer) {
      if(err)
      {
        console.log("error in finding the offer");
      }
      else
      {
        // if(d - offer.expiration_date < 0) send a warning. if yes, send notifications to all the users subscribed to this business
        Offer.remove({_id:id}, function(err)
        {
          if(err)
          {
            console.log("cannot delete offer");
            res.send("cannot delete offer");
          }
          else
          {
            console.log("offer deleted");
            // res.send("offer deleted");
            Offer.find({business:businessId},function(err, myoffers) {
              if(err)
              {
                console.log("cannot get my offers");
              }
               else
              {
                res.send(myoffers);
              }
            });
          }
        })
      }
    })
  }
};
