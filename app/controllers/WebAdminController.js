var WebAdmin = require('mongoose').model('WebAdmin');
var Business = require('mongoose').model('Business');
var generator = require('generate-password');
var Events = require('mongoose').model('Events');
var Advertisement = require('mongoose').model('Advertisement');
const nodemailer = require('nodemailer');


exports.AddBusiness = function (req, res) {
    var username = req.body.username;

    var generatedPassword = generator.generate({
        length: 10,
        numbers: true
    });
    var hashedPassword = generateHash(generatedPassword);
    Business.findOne({ username: username }, function (err, user) {
        if (err) { return next(err); }
        if (business) {
            res.send("user already exist");
        }
        else {
            var business = new Business(
                {
                    username: username,
                    password: hashedPassword,
                    merchant_ID: req.body.merchant_ID,
                    category: req.body.category

                });

            business.save(function (err, business) {

                if (err)
                    throw err;

                res.send("Business added");

            });



        }
    });

}







//i am not sure about attribute name deleted ? ,,, and business attribute name in offer... check eno m3ndosh booking

exports.WebAdminDeleteBusiness = function (req, res) {



    Business.findByIdAndRemove(req.params.name, function (err, business) {
        if (err) throw err;
        Offer.remove({ business: req.params.name }, function (err) {
            if (err) throw err;
        })
        Events.remove({ business_id: req.params.name }, function (err) {
            if (err) throw err;
        })
    });
    res.send("Business Deleted Successfully");
};




exports.webAdminViewRequestedDelete = function (req, res) {
    Business.find({ deleted: 1 }, function (err, requests) {
        res.render('requestedDelete', requests);

    }
    );
}




























//<=========================================================================ADVERTISEMENT=======================================================================>


exports.addAdvertisement = function(req,res)
{
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
      res.send("error saving advertisement");
    else
      res.send("successfully created advertisement");

  });
}





exports.deleteAdvertisement = function(req,res)
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




exports.updateAvailableAdvertisements = function(req,res)
{
  var rule = new schedule.RecurrenceRule();
  rule.dayOfWeek = [new schedule.Range(0,6)];
//  rule.hour = 0;
//  rule.minute = 0;


  var j = schedule.scheduleJob(rule, function()
  {
    var d = new Date();
    Advertisement.find({}, function(err, ads)
    {
      for(var i = 0; i < ads.length; i++)
      {
        if(ads[i].edate < d || ads[i].sdate < d)
          ads[i].available = 0;
        else {
          ads[i].available = 1;
        }
      }
      ads.save();
    })
  });


}

exports.viewAvailableAdvertisements = function(req,res)
{
  Advertisement.find({available : 1}, function(err, ads)
  {
    res.send(ads);
  });
}
