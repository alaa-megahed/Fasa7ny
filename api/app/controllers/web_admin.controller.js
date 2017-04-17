var WebAdmin = require('mongoose').model('WebAdmin');
var Business = require('mongoose').model('Business');
var generator = require('generate-password');
var Events = require('mongoose').model('Events');
var EventOcc = require('mongoose').model('EventOccurrences');
var Offer = require('mongoose').model('Offer');
var User = require('mongoose').model('RegisteredUser');
var Review = require('mongoose').model('Review');
var Reply = require('mongoose').model('Reply');
var async = require('async');
var StatsController = require('./stats.controller');
const nodemailer = require('nodemailer');
var configAuth = require('../../config/auth');


exports.AddBusiness = function (req, res) {

    //test if name and merchant_ID
    Business.find({
        $or: [
            { 'local.username': req.body.username },
            { name: req.body.name },
            { merchant_ID: req.body.merchant_ID },
             {'email': req.body.email}
        ]
    }, //check if business is unique
        function (err, resultBusiness) {
            console.log(resultBusiness);
            if (err) { return next(err); }

            if (resultBusiness.length == 0) {   //if yes then check user
                User.find({
                    $or: [
                        { 'local.username': req.body.username },
                        {'email': req.body.email}
                    ]
                },
                    function (err, resultUser) {
                        if (err)
                            console.log(err);
                        else if (resultUser.length == 0) {

                            WebAdmin.find({ $or: [
                                    { 'local.username': req.body.username },
                                    {'email': req.body.email}
                                ]},
                                    function (err, resultAdmin) {

                                    if (err)
                                        console.log(err);
                                    else if (resultAdmin.length == 0) {
                                        var business = new Business();
                                        var generatedPassword = generator.generate({
                                            length: 10,
                                            numbers: true
                                        });
                                        business.local.password = business.generateHash(generatedPassword);
                                        business.local.username = req.body.username;
                                        business.name = req.body.name;
                                        business.merchant_ID = req.body.merchant_ID;
                                        business.category = req.body.category;
                                        business.email = req.body.email;

                                        business.save(function (err, newBusiness) {

                                            if (err)
                                                throw err;
                                            else {
                                                //add statistics about business 
                                                StatsController.addStat(new Date(), newBusiness._id, 'views', 0);

                                                //schedule statistics for the future 
                                                StatsController.schedule(newBusiness._id);

                                                //send confirmation email 

                                                var smtpTransport = nodemailer.createTransport({
                                                    service: 'Gmail',
                                                    auth: {
                                                        user: configAuth.gmail.user,
                                                        pass: configAuth.gmail.pass
                                                    }

                                                });
                                                console.log(1);
                                                var mailOptions = {
                                                    to: req.body.email,
                                                    from: 'fasa7ny.team@gmail.com',
                                                    subject: 'Confirmation Mail',
                                                    text: 'Welcome to Fasa7ny' + '\n\n' + 'You have successfully joined our platform' + '\n'
                                                    + 'You can login to create your profile' + '\n\n' + 'Username: ' + req.body.username +
                                                    '\n' + 'Password: ' + generatedPassword + '\n\n' + 'http://' + req.headers.host + '\n\n' +
                                                    'Fasa7ny team'

                                                };
                                                console.log(2);
                                                smtpTransport.sendMail(mailOptions, function (err) {
                                                    if (err)
                                                        console.log(err);
                                                    req.flash('info', 'An e-mail has been sent to ' + req.body.email + ' with further instructions.');

                                                });
                                                console.log(3);
                                                res.render("admin_profile", { user: req.user });

                                            }
                                        });
                                    } //end of web admin check
                                    else {
                                        console.log(resultAdmin);
                                        console.log("conflict with web admin");
                                        res.render("admin_profile", { user: req.user });
                                    }
                                });
                        }//end of user check
                        else {
                            console.log(resultUser)
                            console.log("conflict with user");
                            res.render("admin_profile", { user: req.user });

                        }
                    }
                );
            }//end of business check
            else {
                console.log(resultBusiness);
                console.log("conflict with business");
                res.render("admin_profile", { user: req.user });

            }

        });
}



//i am not sure about attribute name deleted ? ,,, and business attribute name in offer... check eno m3ndosh booking

exports.WebAdminDeleteBusiness = function (req, res) {


    Business.findById(req.params.id, function (err, business) {
        if (err)
            throw err;
        //remove offers
        Offer.remove({ business: business._id }, function (err) {

            if (err) throw err;
        });
        //remove events of the business
        Events.find({ business_id: business._id }, function (err, events) {
            if (err) throw err;
            else
            {
                async.each(events, function(event, callback){
                    EventOcc.remove({ event: event._id }, function (err) {
                        if (err)
                            throw err;
                    });
                });

                Events.remove({ business_id: business._id }, function (err) {
                    if (err)
                        throw err;
                });
            }

        });

        //remove business from subscribers

        async.each(business.subscribers, function(subscriber, callback){
            User.findById(subscriber, function (err, user) {
                if (err)
                    throw err;
                else {
                    var subs = user.subscriptions;
                    var index = subs.indexOf(business._id);
                    if (index > -1) {
                        subs.splice(index, 1);
                        User.findByIdAndUpdate(subscriber, { $set: { subscriptions: subs } }, function (err, userResult) {
                            if (err)
                                throw err;

                        });
                    }
                }
            }); 
        });

        Business.findByIdAndRemove(req.params.id, function (err, business) {
            if (err)
                throw err;
        });

        Business.find({ delete: 1 }, function (err, requests) {
            if (err)
                throw err;
            res.render('requestedDelete', { user: req.user, requests: requests });
        });
    });


}



exports.webAdminViewRequestedDelete = function (req, res) {

if(req.user && req.user instanceof WebAdmin)
  {
    Business.find({ delete: 1 }, function (err, requests) {
        res.render('requestedDelete', { user: req.user, requests: requests });

    });
  }
  else {
    return res.send("Unauthorized access. Please log in.");
  }
    
}









//<=========================================================================ADVERTISEMENT=======================================================================>


exports.addAdvertisement = function(req,res)
{


  if(req.user && req.user instanceof WebAdmin)
  {

    if(!req.body.filename || !req.body.text || !req.body.sdate || !req.body.edate)
    {
      return res.send("Please fill in all necessary components");
    }
    var ad = new Advertisement(
      {
        image       : req.body.filename, //should be changed to req.file.filename
        text        : req.body.text,
        start_date  : req.body.sdate,
        end_date    : req.body.edate
      }
    )

    ad.save(function(err,ad){
      if(err)
        return res.send("error saving advertisement");
      else
        return res.send("successfully created advertisement");

    });
  }
  else {
    return res.send("Unauthorized access. Please log in.");
  }

}





exports.deleteAdvertisement = function(req,res)
{

    if(req.user && req.user instanceof WebAdmin)
    {
      Advertisement.findByIdAndRemove(req.body.ad, function(err,ad)
      {
        if(err)
          res.send("error deleting advertisement");
        else {
          res.send("successfully deleted advertisement");
        }

      });
    }



}




exports.updateAvailableAdvertisements = function(req,res)
{
  var rule = new schedule.RecurrenceRule();
  rule.dayOfWeek = [new schedule.Range(0,6)];
  rule.hour = 00;
  rule.minute = 00;


  var j = schedule.scheduleJob(rule, function()
  {
    var d = new Date();
    Advertisement.find({}, function(err, ads)
    {
      console.log(ads);
      for(var i = 0; i < ads.length; i++)
      {
        if(ads[i].end_date < d || ads[i].start_date > d)
        {
          console.log("this has expired: " + ads[i]);
          ads[i].available = 0;
          ads[i].save();
        }
        else {
          ads[i].available = 1;
          ads[i].save();
        }
      }


      res.send("successful");

    })
  });


}

exports.viewAvailableAdvertisements = function(req,res)
{
  if(req.user && req.user instanceof WebAdmin)
  {
    Advertisement.find({available : 1}, function(err, ads)
    {
      res.send(ads);
    });
  }
  else {
    return res.send("Unauthorized access. Please log in.");
  }

}
