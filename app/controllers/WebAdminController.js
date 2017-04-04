var WebAdmin = require('mongoose').model('WebAdmin');
var Business = require('mongoose').model('Business');
var generator = require('generate-password');
var Events = require('mongoose').model('Events');
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