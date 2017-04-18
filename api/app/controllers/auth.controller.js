var passport = require('passport'),
    async    = require('async'),
    crypto   = require('crypto'),
    configAuth = require('../../config/auth'),
    User = require('../models/RegisteredUser'),
    Business   = require('../models/Business'),
    nodemailer = require("nodemailer"),
    configAuth = require('../../config/auth'),
    xoauth2 = require('xoauth2');

let AuthController = 
{
	// ============================
	// 			   HOME PAGE 
	// ============================
	home: function(req, res) {
		res.render('index.ejs'); 
	},

	// ============================
	// 		    	LOGIN 
	// ============================
	getLogin: function(req, res) {

		res.render('login.ejs', { message: req.flash('loginMessage') });
	},

	postLogin: function(req, res){passport.authenticate('local-login', {
		successRedirect : '/auth/profile', 
		failureRedirect : '/auth/login', 
		failureFlash : true 
	})(req, res);},

	// ============================
	//           SIGNUP 
	// ============================
	getSignup: function(req, res) {
		res.render('signup.ejs', { message: req.flash('signupMessage') });
	},

	postSignup: function(req, res){passport.authenticate('local-signup', {
		successRedirect : '/auth/profile', 
		failureRedirect : '/auth/signup', 
		failureFlash : true 
	})(req, res);},

	// ============================
	// 	    PROFILE SECTION 
	// ============================
	getProfile: function(req, res){
		if (req.isAuthenticated())
		{
			if(req.user.user_type == 1)       // regular user
			{
        res.redirect('http://localhost:3000/user/customize');
        // res.render('user_profile.ejs', {
        // user : req.user, bookings: req.user.bookings, subscriptions: req.user.subscriptions });  
			}
			else if(req.user.user_type == 2)  // business
			{
        res.render('business_profile.ejs', {
          user : req.user });
			}
			else if(req.user.user_type == 3)  // admin
			{
				res.render('admin_profile.ejs', {
				user : req.user}); 	
			}	
		}
		else
    {
			res.redirect('/');
    }
	},

	// =====================================
	// 				     LOGOUT 
	// =====================================
	logout: function(req, res) {
		req.logout();
		req.session.destroy(function (err) {
    res.redirect('/'); 
  });
	},

	// =====================================
	// 			     	FACEBOOK 
	// =====================================
	facebookLogin   : function(req, res){
		passport.authenticate('facebook', { scope : 'email' })(req, res);},

	facebookCallback: function(req, res){
		passport.authenticate('facebook', {
            						successRedirect : '/auth/profile',
            						failureRedirect : '/'
       							   })(req, res);
								},
									
	// =====================================
	// 			      	GOOGLE 
	// =====================================
	googleLogin : function(req, res){
		passport.authenticate('google', { scope : ['profile', 'email'] })(req, res);
	},

	googleCallback: function(req, res){
		passport.authenticate('google', { failureRedirect: 'http://localhost:3000', successRedirect :'http://localhost:3000/auth/profile'})(req, res);
	},

	// =====================================
	// 		     FORGOT PASSWORD 
	// =====================================
	getForgetPassword: function(req, res){
		res.render('frogetPassword.ejs');
	},

	forgotPassword: function(req, res, next) {
  		async.waterfall([
      // generate random token of length 20, to uniquely identify each request of reseting password  
    	function(done) {
      	crypto.randomBytes(20, function(err, buf) {
        	var token = buf.toString('hex');
        	done(err, token);
    	  });
   		},
      // validate the entered email belongs to some actual user saved in the database
      // first, search the business collection
    	function(token, done) {
        var check = 0;
        Business.findOne({ email: req.body.email }, function(err, business){
              if(err)
              {
                  console.log("Sorry for inconvenience, your trial to reset the password has been denied");
                  return res.redirect('/auth/forgot');
              }
              if(!business)
              {
                check++;
                if(check == 2)    // if no user found, print error msg and redirect
                {
                console.log('error', 'No account with that email address exists.');
                return res.redirect('/auth/forgot');
                }
              }
              // if found, set the values of resetPasswordToken to the token generated
              else
               { 
                 business.local.resetPasswordToken = token;
                 business.local.resetPasswordExpires = Date.now() + 3600000;    // expires after one hour
                 business.save(function(err){
                
                 done(err, token, business);
              });
            }
        });  
        // then search the registeredusers collection
      		User.findOne({ email: req.body.email }, function(err, user) {
            if(err)
              {
                  console.log("Sorry for inconvenience, your trial to reset the password has been denied");
                  return res.redirect('/auth/forgot');
              }
        	if (!user) {
            check++;
            if(check == 2)       // if no user found, print error msg and redirect
            {
              console.log('error', 'No account with that email address exists.');
              return res.redirect('/auth/forgot');
            }
                                           
        	}
          // if found, set the values of resetPasswordToken to the token generated
          else
          {
        	   user.local.resetPasswordToken = token;
        	   user.local.resetPasswordExpires = Date.now() + 3600000;   // expires after one hour
        	   user.save(function(err) {
        		  if(err)
              {
                  console.log("Sorry for inconvenience, your trial to reset the password has been denied");
                  return res.redirect('/auth/forgot');
              }
          	done(err, token, user);
        	});
          }
      	});
    	},
      
      // the next function actually sends the email with the reset url
    	function(token, user, done) {  
        // first login via our Gmail account, (this might be modified to use XOAuth2 later)
        var smtpTransport = nodemailer.createTransport({
        service:'Gmail',
        auth:
        {
            user: configAuth.gmail.user,
       		  pass: configAuth.gmail.pass
        }
      });
        // set the values of sender, receiver, subject and body of the mail
        var mailOptions = {
        	to: user.email,
        	from: 'fasa7ny.team@gmail.com',
        	subject: 'Fasa7ny Password Reset',
        	text: 'You are receiving this because you (or someone else) have requested the reset of the password for your account.\n\n' +
          	'Please click on the following link, or paste this into your browser to complete the process:\n\n' +
          	'http://' + req.headers.host + '/auth/reset/' + token + '\n\n' +                                    //url containing the token generated
          	'If you did not request this, please ignore this email and your password will remain unchanged.\n'
     		};
     	  // send the email using nodeMailer, and previously specified options
      	smtpTransport.sendMail(mailOptions, function(err) {
      			if(err)
            {
      				console.log("ERROR: can not send email to the entered email, please try again");
              return res.redirect('/auth/forgot');
            }
        	console.log('info', 'An e-mail has been sent to ' + user.email + ' with further instructions.');
       		done(err, 'done');
      	});
    	}
  		], function(err) {
    	if (err) return next(err);
    	res.redirect('/');
  	  });
	},

	getReset: function(req, res) {
        var check = 0;
        // check the validity of the token sent in the url 
        // first search the business collection
        Business.findOne({ "local.resetPasswordToken": req.params.token, "local.resetPasswordExpires": { $gt: Date.now() } }, function(err, business){
        if(!business)
        {
          check++;
          if(check == 2)      // if no user found, print error msg and redirect
          {
          console.log('error', 'Password reset token is invalid or has expired.');
          return res.redirect('/auth/forgot'); 
          }
        }
        else
        {
          res.render('reset', {
          user: req.user,
          token: req.params.token
          });
        }
      });
        // search the registeredusers collection
 	 User.findOne({ "local.resetPasswordToken": req.params.token, "local.resetPasswordExpires": { $gt: Date.now() } }, function(err, user) {
   	 if (!user) {
      check++;
      if(check == 2)      // if no user found, print error msg and redirect
      {
        console.log('error', 'Password reset token is invalid or has expired.');
      return res.redirect('/auth/forgot');
      }  
    	}
      else
      {
    	res.render('reset', {
      	user: req.user,
      	token: req.params.token
    	});
    }
  	  });
	},

	postReset: function(req, res) {
  async.waterfall([
    // recheck the validity of the token sent (it might be expired)
    function(done) {
      var check = 0;
          Business.findOne({ "local.resetPasswordToken": req.params.token, "local.resetPasswordExpires": { $gt: Date.now() } }, function(err, business){
            if(!business)
            {
              check++;
              if(check == 2)
              {
              console.log('error', 'Password reset token is invalid or has expired.');
              return res.redirect('/auth/forgot');
              }
            }
            // save the new password, and reset token related attributes
            else
            {
              business.local.password = business.generateHash(req.body.password);
              business.local.resetPasswordToken = undefined;
              business.local.resetPasswordExpires = undefined;
              business.save(function(err, business){
                 if(err)
                 { 
                  console.log("error: can not update the password, please try again");
                  return res.redirect('/auth/login');
                 }
              });
            }
          });
      User.findOne({ "local.resetPasswordToken": req.params.token, "local.resetPasswordExpires": { $gt: Date.now() } }, function(err, user) {
        if (!user) {
          check++;
              if(check == 2)
              {
              console.log('error', 'Password reset token is invalid or has expired.');
              return res.redirect('/auth/forgot');
              }
        }
        // save the new password, and reset token related attributes
        else
        {
        user.local.password = user.generateHash(req.body.password);
        user.local.resetPasswordToken = undefined;
        user.local.resetPasswordExpires = undefined;
        user.save(function(err,user) {
            if(err)
            { 
              console.log("error: can not update the password, please try again");
              return res.redirect('/auth/login');
            }
            done(err, user);
        });
      }
      });
    },
   // send confirmation mail
    function(user, done) {
        var smtpTransport = nodemailer.createTransport({
        service:'Gmail',
        auth:
        {
            user: configAuth.gmail.user,
            pass: configAuth.gmail.pass
        }
      });
      var mailOptions = {
        to: user.email,
        from: 'passwordreset@demo.com',
        subject: 'Your password has been changed',
        text: 'Hello,\n\n' +
          'This is a confirmation that the password for your account ' + user.email + ' has just been changed.\n'
      };
      smtpTransport.sendMail(mailOptions, function(err) {
        if(err)
        {
          console.log("ERROR: can not send email to the entered email, please try again");
          return res.redirect('/auth/forgot');
        }
        console.log('success', 'Success! Your password has been changed.');
        done(err);
      });
    }
  ], function(err) {
    res.redirect('/auth/login');
  });
},

getStripePK: function(req, res)
{
  return res.status(200).json(configAuth.stripe.publicKey);
}


}

module.exports = AuthController;



