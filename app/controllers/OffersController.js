var mongoose = require('mongoose');
var Business = mongoose.model('Business');
var Offer = mongoose.model('Offer');


/* this function views all the offers created by a business by finding the offers
 having the same id as the id of the business passed to the function. */
exports.viewOffers = function(req, res) {
  console.log("hay");
  if(typeof req.query.id != "undefined") {
    console.log(req.query.id);
    var id = req.query.id;
    Offer.find({business:id}, function(err, offers) {
      if(err) {
        console.log("error in finding all offers");
      } else {
          res.render("view_offers", {offers:offers});
      }
    })
  } else if(req.user && req.user instanceof Business) {
      var id = req.user.id;
      console.log(id);
      Offer.find({business:id}, function(err, offers) {
        if(err) {
          console.log("error in finding all offers");
        } else {
            res.render("crudoffer", {offers:offers, id:req.user.id});
        }
    })
  } else {
    res.send("enter a business to find its offers");
  }
}

/*this function is used by business to create an offer where he must enter
the name, type, value, details and expiration date.
if the business added an expiration_date that is before the start_date(which if
 he did not enter it will be by default the current date when he created the offer)
 he will be notified that he entered a wrong expiration_date */
exports.createOffer = function(req, res) {
  if(req.user && req.user instanceof Business) {
    var businessId = req.user.id;  //get _id from session
    var body = req.body;
    var file = req.file;

    if(!body.name || !body.type || !body.value || !body.details || !body.expiration_date) {
      console.log("please add all information");
      res.send("please add all information");
      //send back to add offer page
    } else {
      var newOffer = new Offer({
        name:body.name,
        type:body.type,
        value:body.value,
        details:body.details,
        expiration_date:new Date(body.expiration_date)
      });
      newOffer.business = businessId;

      if(typeof file != 'undefined') {
        newOffer.image = file.filename;
      }
      if(typeof body.notify_subscribers != 'undefined' && body.notify_subscribers.length > 0) {
        newOffer.notify_subscribers = body.notify_subscribers;
      }
      if(typeof body.start_date != 'undefined' && body.start_date > 0) {
        newOffer.start_date = new Date(body.start_date);
      } else {
        newOffer.start_date = new Date();
      }
      var startdate = newOffer.start_date;
      var expirationdate = newOffer.expiration_date;
      // console.log(d1);
      // console.log(d2);
      if(startdate - expirationdate >= 0) {
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
displayed.
At the beginning before updating anything, we check if such offer belongs to
the following business or not */
exports.updateOffer = function(req, res) {

  if(req.user && req.user instanceof Business && typeof req.query.id != "undefined") {
    var body = req.body;
    var businessId = req.user.id;
    var id = req.query.id;
    var file = req.file;

    Offer.findOne({_id:id}, function(err, offer1){
      if(err) console.log("error in finding the offer");
      else {
        if(!offer1)console.log ("enter a valid offer");
        else {
          if(offer1.business.equals(businessId)) {
            if(typeof body.name != 'undefined' && body.name.length != 0) {
              Offer.findByIdAndUpdate(
                id,
                {$set:{name:body.name}},
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

            if(typeof body.type != 'undefined' && body.type.length != 0) {
              Offer.findByIdAndUpdate(
                id,
                {$set:{type:body.type}},
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

            if(typeof body.value != 'undefined' && body.value.length != 0) {
              Offer.findByIdAndUpdate(
                id,
                {$set:{value:body.value}},
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

            if(typeof body.details != 'undefined' && body.details.length != 0) {
              Offer.findByIdAndUpdate(
                id,
                {$set:{details:body.details}},
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

            if(typeof body.start_date != 'undefined' && body.start_date.length != 0) {
              Offer.findByIdAndUpdate(
                id,
                {$set:{start_date:body.start_date}},
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

            if(typeof body.expiration_date != 'undefined' && body.expiration_date.length != 0) {

              Offer.findOne({_id:id}, function(err, offer1) {
                if(err) console.log("error in finding offer for updating the expiration_date");
                else {
                  var startdate = offer1.start_date;
                  var expirationdate = new Date(body.expiration_date);

                  if(startdate - expirationdate >= 0) {
                    console.log("please add a valid expiration_date");
                  } else {
                    Offer.findByIdAndUpdate(
                      id,
                      {$set:{expiration_date:body.expiration_date}},
                      function(err, offer) {
                        if(err) {
                          console.log("error in updating expiration_date");
                          console.log(offer);
                          console.log(body.expiration_date);
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

            if(typeof body.notify_subscribers != 'undefined' && body.notify_subscribers.length != 0) {
              Offer.findByIdAndUpdate(
                id,
                {$set:{notify_subscribers:body.notify_subscribers}},
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

            if(typeof file != 'undefined') {
              Offer.findByIdAndUpdate(
                id,
                {$set:{image:file.filename}},
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

            Offer.find({business:businessId}, function(err, offers) {
              if(err) {
                console.log("error in finding offer");
                res.send("error in finding offer");
              } else {
                console.log(offers);
                if(offers) res.render("crudoffer", {offers:offers, id:req.user.id});
                else res.send("enter a valid offer");
              }
            })
          } else {
            console.log("you must update only your offers");
          }
        }
      }
    })
  }
};



/* a business can delete an offer.*/
exports.deleteOffer = function(req, res) {
  if(req.user && req.user instanceof Business && typeof req.query.id != "undefined") {
    var id = req.query.id;
    var businessId = req.user.id;
    var d = new Date();
    Offer.findOne({_id:id}, function(err, offer) {
      if(err)
      {
        console.log("error in finding the offer");
      }
      else
      {
        if(offer && offer.business.equals(businessId)) {
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
                  if(myoffers) res.render("crudoffer", {offers:myoffers, id:req.user.id});
                }
              });
            }
          })
        } else console.log("you must delete only your offers");
      }
    })
  }
};
