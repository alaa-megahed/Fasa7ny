var WebAdmin  = require('mongoose').model('WebAdmin');
var Business  = require('mongoose').model('Business');
var generator = require('generate-password');
var Events = require('mongoose').model('Events');
<<<<<<< HEAD
var Offer = require('mongoose').model('Offer');
var User = require('mongoose').model('RegisteredUser');
var Review = require('mongoose').model('Review');
var Reply   = require('mongoose').model('Reply');
var   async = require('async');
=======
var User   = require('mongoose').model('RegisteredUser');
var Review = require('mongoose').model('Review');
var Reply  = require('mongoose').model('Reply');
>>>>>>> c328b15fd48fd3dc55f32a03c487eec8f31e1813
const nodemailer = require('nodemailer');
var configAuth = require('../../config/auth');


exports.AddBusiness = function (req, res) {

    Business.findOne({ username: req.body.username }, function (err, user) {
        if (err) { return next(err); }
        // if (business) {
        //  return res.render("admin_profile", {user: req.user});
        // }
    });
    
    var business = new Business();
    var generatedPassword = generator.generate({
        length: 10,
        numbers: true
    });
<<<<<<< HEAD
    business.local.password = business.generateHash(generatedPassword);
    business.local.username = req.body.username;
    business.name = req.body.name;
    business.merchant_ID = req.body.merchant_ID;
    business.category = req.body.category;
    business.email= req.body.email;
    
            business.save(function (err) {
=======
    var hashedPassword = generateHash(generatedPassword);
    Business.findOne({ username: username }, function (err, user) {
        if (err) { return next(err); }
        if (business) {
            res.send("user already exist");
        }
        else {
            var business = new Business(
                {
                    name: req.body.name,
                    username: username,
                    password: hashedPassword,
                    merchant_ID: req.body.merchant_ID,
                    category: req.body.category

                });

            business.save(function (err, business) {
>>>>>>> c328b15fd48fd3dc55f32a03c487eec8f31e1813

                if (err)
                    throw err;
            });

  
        var smtpTransport = nodemailer.createTransport({
        service:'Gmail',
        auth:{
            // XOAuth2: {
            //     user:'fasa7ny.team@gmail.com',
            //     clientId:configAuth.googleAuth.clientID,
            //     clientSecret:configAuth.googleAuth.clientSecret,
            //     refreshToken:configAuth.googleAuth.accessToken,
            //     accessToken: configAuth.googleAuth.accessToken // optional 
            // }
            user: configAuth.gmail.user,
              pass: configAuth.gmail.pass
        }
<<<<<<< HEAD
      });

        var mailOptions = {
            to: req.body.email,
            from: 'fasa7ny.team@gmail.com',
            subject: 'Confirmation Mail',
            text: 'Welcome to Fasa7ny' + '\n\n'+ 'You have successfully joined our platform' + '\n' 
            + 'You can login to create your profile' +'\n\n'+ 'Username: '+ req.body.username +
            '\n' + 'Password: '+ generatedPassword + '\n\n' + 'http://' + req.headers.host + '\n\n'+
            'Fasa7ny team'

        };
        
        smtpTransport.sendMail(mailOptions, function(err) {
                if(err)
                    console.log("error");
            req.flash('info', 'An e-mail has been sent to ' + req.body.email + ' with further instructions.');
            
        });
        res.render("admin_profile", {user: req.user});
    
        }
       
=======
    });

}

// exports.WebAdminDeleteUser = function(req,res){
//     var username = req.body.username;
//         User.remove({username:username}, function(err,user){
//             if(err) res.send('could not remove user');
//             else{
//                 Review.remove({user:user}, function(err){
//                     if(err) res.send('could not remove user');
//                 });
                

//             }
//         });

// }



>>>>>>> c328b15fd48fd3dc55f32a03c487eec8f31e1813

//i am not sure about attribute name deleted ? ,,, and business attribute name in offer... check eno m3ndosh booking

exports.WebAdminDeleteBusiness = function (req, res) {

<<<<<<< HEAD
Business.findByIdAndRemove(req.params.id, function (err,business){
            if(err)
                throw err;
           
              Offer.remove({ business: business._id }, function (err) {
=======
    Business.findByIdAndRemove(req.params.name, function (err, business) {
        if (err) throw err;
        Offer.remove({ business: req.params.name }, function (err) {
>>>>>>> c328b15fd48fd3dc55f32a03c487eec8f31e1813
            if (err) throw err;
        });

            Events.remove({ business_id: business._id }, function (err) {
            if (err) throw err;
        });
            
        Business.find({ delete: 1 }, function (err, requests) {
         res.render('requestedDelete', {user: req.user, requests: requests});
       });
  });   
 
        
}



exports.webAdminViewRequestedDelete = function (req, res) {
<<<<<<< HEAD
    Business.find({ delete: 1 }, function (err, requests) {
        res.render('requestedDelete', {user: req.user, requests: requests});
=======
    Business.find({ deleted: 1 }, function (err, requests) {
        res.render('delete_requests', requests);
>>>>>>> c328b15fd48fd3dc55f32a03c487eec8f31e1813

    }
  );
}