var Business = require('../models/Business');

var BusinessController = {
    getBusiness: function (req, res) {
        var name = req.params.name;
        Business.findOne({ name: name }).
            exec(function (err, result) {
                if (err)
                    console.log(err);
                else
                    res.send(result);
            });

    },

    /* A business can request to be removed from the website. */

    requestRemoval: function(req,res) {
        // if(req.user){
        var id = req.body.id;
        Business.findByIdAndUpdate(id,{$set:{delete:1}}, function(err,business){
            if(err) res.send("error in request removal");
            else res.send("Requested!");
        });

        // }

        // else{
        //  console.log('not logged in');
        // }
    },

    makePagePublic: function(req, res) {
      if(req.user && req.user instanceof Business) {
        var businessId = req.user.id;
        Business.findByIdAndUpdate(businessId, {$set:{public:1}},
          function(err) {
            if(err) {
              console.log("error in making page public");
            } else {
              console.log("Page public");
              res.send("done");
            }
        });
      }
  },



    editInformation: function(req,res){
        // if(req.user){
            // var id = req.query.id;
            var id = "58e368c90a4710a67fec4931";

            if(typeof req.body.password != "undefined" && req.body.password.length > 0){
                Business.findByIdAndUpdate(id,{$set:{password:req.body.password}}, function(err,info){
                    if(err) res.send('Could not update');
                    else res.send('password updated');
                });
            }
            if(typeof req.body.description != "undefined" && req.body.description.length > 0){
                Business.findByIdAndUpdate(id,{$set:{description:req.body.description}}, function(err,info){
                    if(err) res.send('Could not update');
                    else res.send('description updated');
                });
            }
            if(typeof req.body.location != "undefined" && req.body.location.length > 0){
                Business.findByIdAndUpdate(id,{$set:{location:req.body.location}}, function(err,info){
                    if(err) res.send('Could not update');
                    else res.send('location updated');
                });
            }
            if(typeof req.body.email != "undefined" && req.body.email.length > 0){
                Business.findByIdAndUpdate(id,{$set:{email:req.body.email}}, function(err,info){
                    if(err) res.send('Could not update');
                    else res.send('email updated');
                });
            }
              if(typeof req.body.address != "undefined" && req.body.address.length > 0){
                Business.findByIdAndUpdate(id,{$set:{address:req.body.address}}, function(err,info){
                    if(err) res.send('Could not update');
                    else res.send('address updated');
                });
            }
              if(typeof req.body.area != "undefined" && req.body.area.length > 0){
                Business.findByIdAndUpdate(id,{$set:{area:req.body.area}}, function(err,info){
                    if(err) res.send('Could not update');
                    else res.send('area updated');
                });
            }
            if(typeof req.body.phones != "undefined" && req.body.phones.length > 0){
                Business.findByIdAndUpdate(id,{$push:{"phones":req.body.phones}}, function(err,info){
                    if(err) res.send('Could not update');
                    else res.send('phones updated');
                });
            }
            if(typeof req.body.payment_methods != "undefined" && req.body.payment_methods.length > 0){
                Business.findByIdAndUpdate(id,{$push:{"payment_methods":req.body.payment_methods}}, function(err,info){
                    if(err) res.send('Could not update PAYMENT');
                    else res.send('payment_methods updated');
                });
            }


        // }
    },
    deletePhone: function(req,res){
        var id = "58e368c90a4710a67fec4931";
        var phone = req.body.phone;
        Business.findOne({_id:id},function(err,business){
            if(err) res.send('couldnt find a business');
            else{
                if(business.phones.length < 2)
                    res.send('Must have at least one phone number');
                else{
                    Business.findByIdAndUpdate(id,{$pull:{"phones":phone}}, function(err,info){
                    if(err) res.send('Could not delete');
                    else res.send('phone deleted');
                });

                }
            }
        });

    },


    deletePaymentMethod: function(req,res){
         var id = "58e368c90a4710a67fec4931";
        var payment = req.body.payment_methods;
        Business.findOne({_id:id},function(err,business){
            if(err) res.send('couldnt find a business');
            else{
                if(business.payment_methods.length < 2)
                    res.send('Must have at least one payment method');
                else{
                    Business.findByIdAndUpdate(id,{$pull:{"payment_methods":payment}}, function(err,info){
                    if(err) res.send('Could not delete');
                    else res.send('payment method deleted');
                });

                }
            }
        });

    }

}

module.exports = BusinessController;
