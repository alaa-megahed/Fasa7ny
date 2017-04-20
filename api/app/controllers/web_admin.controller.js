var WebAdmin = require('mongoose').model('WebAdmin');
var Business = require('mongoose').model('Business');
var generator = require('generate-password');
var Events = require('mongoose').model('Events');
var EventOcc = require('mongoose').model('EventOccurrences');
var Facility = require('mongoose').model('Facility');
var Offer = require('mongoose').model('Offer');
var User = require('mongoose').model('RegisteredUser');
var Review = require('mongoose').model('Review');
var Reply = require('mongoose').model('Reply');
var async = require('async');
var Advertisement = require('mongoose').model('Advertisement');

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

                                        business.save(function (err) {

                                            if (err)
                                                throw err;
                                            else { //send confirmation email
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
                                                //res.render("admin_profile", { user: req.user });
                                                res.status(200).json("successfully added");

                                            }
                                        });
                                    } //end of web admin check
                                    else {
                                        console.log(resultAdmin);
                                        console.log("conflict with web admin");
                                        //res.render("admin_profile", { user: req.user });
                                        res.status(200).json("There is another webAdmin with the same username");
                                    }
                                });
                        }//end of user check
                        else {
                            console.log(resultUser)
                            console.log("conflict with user");
                            // res.render("admin_profile", { user: req.user });

                               res.status(200).json("There is another User with the same username");
                        }
                    }
                );
            }//end of business check
            else {
                console.log(resultBusiness);
                console.log("conflict with business");
                // res.render("admin_profile", { user: req.user });
                    res.status(200).json("There is another business with the same username");
            }

        });
}



//i am not sure about attribute name deleted ? ,,, and business attribute name in offer... check eno m3ndosh booking

exports.WebAdminDeleteBusiness = function (req, res) {


    Business.findById(req.params.id, function (err, business) {
        if(err) res.status(500).json(err.message);

        //remove offers
        Offer.remove({ business: business._id }, function (err) {

           if(err) res.status(500).json(err.message);
        });
        // remove events
        Events.remove({ business_id: business._id }, function (err) {
            if (err)
                if(err) res.status(500).json(err.message);
        });
        // remove facilities
        Facility.remove({business_id: business._id}, function(err){
            if(err) return res.status(500).json(err.message);
        });
        // remove event occuerrences
        EventOcc.remove({business_id: business._id}, function(err){
            if(err) res.status(500).json(err.message);
        });


        //remove business from subscribers

        async.each(business.subscribers, function(subscriber, callback){
            User.findById(subscriber, function (err, user) {
                if (err)
                        res.status(500).json(err.message);
                else {
                    var subs = user.subscriptions;
                    var index = subs.indexOf(business._id);
                    if (index > -1) {
                        subs.splice(index, 1);
                        User.findByIdAndUpdate(subscriber, { $set: { subscriptions: subs } }, function (err, userResult) {
                            if (err)
                                res.status(500).json(err.message);

                        });
                    }
                }
            }); 
        });

        Business.findByIdAndRemove(req.params.id, function (err, business) {
            if (err)
                throw err;
            res.status(200).json("Succefully deleted");
        });

        // Business.find({ delete: 1 }, function (err, requests) {
        //     if (err)
        //         throw err;
        //     res.render('requestedDelete', { user: req.user, requests: requests });
        // });
    });


}



exports.webAdminViewRequestedDelete = function (req, res) {

// if(req.user && req.user instanceof WebAdmin)
//   {
    Business.find({ delete: 1 }, function (err, requests) {
        //res.render('requestedDelete', { user: req.user, requests: requests });
        res.status(200).json(requests);
    });
  }
  // else {
  //   return res.status(200).json("Unauthorized access. Please log in."); 
  //   //res.send("Unauthorized access. Please log in.");
  // }
    
// }









//<=========================================================================ADVERTISEMENT=======================================================================>


exports.addAdvertisement = function(req,res)
{

     console.log("da5al add ads");
  // if(req.user && req.user instanceof WebAdmin)
  // {

    if(!req.body.filename || !req.body.text || !req.body.sdate || !req.body.edate)
    {
         console.log("f 7aga fadya");
      return res.status(200).json("Please fill in all necessary components");
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
        throw err;
      else{
        console.log("3amal save");
        return res.status(200).json("successfully created advertisement");
}
    });
 //  }
  // else {
  //   return res.status(200).json("Unauthorized access. Please log in.");
  // }


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