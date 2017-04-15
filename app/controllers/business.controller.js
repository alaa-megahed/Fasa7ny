var Business = require('../models/Business');
var Events = require('mongoose').model('Events');
var EventOccurrences = require('mongoose').model('EventOccurrences');


var BusinessController = {
    getBusiness: function (req, res) {
        var name = "Habiiba";
        Business.findOne({ name: name }).
            exec(function (err, result) {
                if (err)
                    console.log(err);
                else{
                    console.log(result);
                    res.json({result:result, user:"58f20e01b38dec5d920104f3"});
                    // res.render("", {business: result});
                }
            });

    },

    /* A business can request to be removed from the website.
    If the business has any bookings the request is rejected and a message is sent to the business specifying
    that the request was cancelled and that the business should cancel its bookings first.*/


requestRemoval: function(req,res) {
        // if(req.user && req.user instanceof Business){
        // var id = req.user.id;
        console.log('removal');
        var id = "58f20e01b38dec5d920104f3";
        Business.findByIdAndUpdate(id,{$set:{delete:1}}, function(err,business){
            if(err) res.send("error in request removal");
            else res.send("Requested!");
        });

     //    }

     //    else{
     //     console.log('You are not a logged in busiess');
     // }

    },

    /* A business can make his own page public (by changing the public flag)
    so that Business will now show up in searches and can be viewed by all users.*/
    makePagePublic: function (req, res) {
        // if (req.user && req.user instanceof Business) {
            // var businessId = req.user.id;
            console.log('public');
            var businessId = "58f20e01b38dec5d920104f3";
            Business.findByIdAndUpdate(businessId, { $set: { public: 1 } },
                function (err) {
                    if (err) {
                        res.send("error in making page public");
                    } else {
                        res.send("done");
                    }
                });
        // } else res.send("you must be a logged in business");
    },

    /* A business can edit its personal infromation.*/


    editInformation: function (req, res) {

        // if (req.user && req.user instanceof Business) {
            var id = "58f20e01b38dec5d920104f3";
            console.log("ana fl backend");

            Business.findById(id, function (err, business) {
                if (err) res.send(err.message);
                else if (!business) res.send('Something went wrong');
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
                    if (typeof req.body.area != "undefined" && req.body.area.length > 0) {
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

                    business.save();
                    res.json(business);

                }

            });

        // }

        // else {
        //     res.send('You are not a logged in business');
        // }
    },

    /* A business can request to delete a phone number. If this is business' only phone number then it will
    not be deleted and the business will receive a message. If the business has other phone numbers then this
    one can be deleted. If the business entered a wrong phone number a message is sent to the business
    saying that the phone number was not found.*/
    deletePhone: function (req, res) {
        if (req.user && req.user instanceof Business) {
            if (typeof req.body.phone != "undefined") {
                var id = req.user.id;
                var phone = req.body.phone;
                Business.findOne({ _id: id }, function (err, business) {
                    if (err) res.send('couldnt find a business');
                    else if (!business) res.send('Something went wrong');
                    else {
                        if (business.phones.length < 2)
                            res.send('Must have at least one phone number');
                        else {
                            var check = 0;
                            for (var i = 0; i < business.phones.length && check == 0; i++) {

                                if (business.phones[i] == phone) {
                                    check = 1;
                                }
                            }
                            if (check) {
                                Business.findByIdAndUpdate(id, { $pull: { "phones": phone } }, function (err, info) {
                                    if (err) res.send('Could not delete');
                                    if (!info) res.send('Something went wrong');
                                    else res.send('phone deleted');
                                });
                            }
                            else {
                                res.send('Phone not found!')
                            }

                        }

                    }

                });
            }
            else res.send('Enter a phone numebr to be deleted');
        }

        else {
            res.send('You are not a logged in business');
        }

    },

    /* A business can request to delete a payment method. If this is business' only payment method then it will
    not be deleted and the business will receive a message. If the business has other payment methods then this
    one can be deleted. If the business entered a wrong payment method a message is sent to the business
    saying that the payment method was not found.*/

    deletePaymentMethod: function (req, res) {
        if (req.user && req.user instanceof Business) {
            if (typeof req.body.payment != "undefined") {
                var id = req.user.id;
                var payment = req.body.payment;
                Business.findOne({ _id: id }, function (err, business) {
                    if (err) res.send('couldnt find a business');
                    else if (!business) res.send('Something went wrong');
                    else {
                        if (business.payment_methods.length < 2)
                            res.send('Must have at least one payment method');
                        else {
                            var check = 0;
                            for (var i = 0; i < business.payment_methods.length && check == 0; i++) {

                                if (business.payment_methods[i] == payment) {
                                    check = 1;
                                }
                            }

                            if (check) {
                                Business.findByIdAndUpdate(id, { $pull: { "payment_methods": payment } }, function (err, info) {
                                    if (err) res.send('Could not delete');
                                    if (!info) res.send('Something went wrong');
                                    else res.send('payment method deleted');
                                });

                            }
                            else {
                                res.send('Payment Method not found!');
                            }

                        }
                    }
                });

            }
            else {
                res.send('Enter a payment method to be deleted');
            }
        }
        else {
            res.send('You are not a logged in business');
        }

    }
}

module.exports = BusinessController;
