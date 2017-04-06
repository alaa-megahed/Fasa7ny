var mongoose = require('mongoose');
var Business = mongoose.model('Business');
var Offer = mongoose.model('Offer');


/* this function views all the offers created by a business by finding the offers
 having the same id as the id of the business passed to the function.
 if the user is a business, he will be sent to his offer's page where he
 can update/delete the offers */
exports.viewOffers = function(req, res) {
  if(typeof req.query.id != "undefined") {
    var id = req.query.id;

    Business.findOne({_id:id}, function(err, business) {
      if(err) res.send("error in finding the business to view the offers");
      else {
        if(!business) res.send("business does not exist. enter a valid one");
        else {
          Offer.find({business:id}, function(err, offers) {
            if(err) {
              res.send("error in finding all offers");
            } else {
                res.render("view_offers", {offers:offers});
            }
          })
        }
      }
    })
  } else if(req.user && req.user instanceof Business) {
      var id = req.user.id;
      Offer.find({business:id}, function(err, offers) {
        if(err) {
          res.send("error in finding all offers");
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
      res.send("please add all information");
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
        res.send("please add a valid start_date/ expiration_date");
      } else {
        newOffer.save(function(err, offer) {
          if(err) {
            res.send("error in creating offer");
          } else {
            res.send(offer);
          }
        })
      }
    }
  } else {
    res.send("you're not a logged in business");
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

    Offer.findOne({_id:id}, function(err, offer) {
      if(err) res.send("error in finding the offer");
      else
      {
        if(!offer) res.send("offer does not exist");
        else
        {
          if(offer.business.equals(businessId))
          {
            if(typeof body.name != 'undefined' && body.name.length != 0) offer.name = body.name;
            if(typeof body.type != 'undefined' && body.type.length != 0) offer.type = body.type;
            if(typeof body.value != 'undefined' && body.value.length != 0) offer.value = body.type;
            if(typeof body.details != 'undefined' && body.details.length != 0) offer.details = body.details;

            var startdate = offer.start_date;
            var expirationdate = offer.expiration_date;
            var flag1 = false;
            var flag2 = false;
            if(typeof body.start_date != 'undefined' && body.start_date.length != 0)
            {
               startdate = new Date(body.start_date);
               flag1 = true;
            }

            if(typeof body.expiration_date != "undefined" && body.expiration_date.length != 0)
            {
              expirationdate = new Date(body.expiration_date);
              flag2 = true;
            }
            var error = "";
            if(startdate - expirationdate >= 0) error = "please add a valid start_date/ expiration_date";
            else
            {
              if(flag1 == true) offer.start_date = startdate;
              if(flag2 == true) offer.expiration_date = expirationdate;
            }
            if(typeof body.notify_subscribers != 'undefined' && body.notify_subscribers.length != 0)
              offer.notify_subscribers = body.notify_subscribers;

              if(typeof file != 'undefined') offer.file = file.filename;

              offer.save(function(err, updatedoffer) {
                if(err) res.send("error");
                else res.send(error + "----" +updatedoffer);
              })

          } else res.send("you must update only your offers");
        }
      }
    })
  } else res.send("you're not a logged in business");
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
        res.send("error in finding the offer");
      }
      else
      {
        if(offer && offer.business.equals(businessId)) {
          // if(d - offer.expiration_date < 0) send a warning. if yes, send notifications to all the users subscribed to this business
          Offer.remove({_id:id}, function(err)
          {
            if(err)
              res.send("cannot delete offer");
            else
            {
              Offer.find({business:businessId},function(err, myoffers) {
                if(err)
                  res.send("cannot get my offers");
                 else
                {
                  if(myoffers) res.send("done")
                }
              });
            }
          })
        } else {
          if(!offer) res.send("offer does not exist");
          else res.send("you must delete only your offers");
        }
      }
    })
  } else {
    res.send("you're not a logged in business");
  }
};
