var passport = require('passport'),
    async = require('async'),
    crypto = require('crypto'),
    configAuth = require('../../config/auth'),
    User = require('../models/RegisteredUser'),
    Business = require('../models/Business'),
    nodemailer = require("nodemailer"),
    configAuth = require('../../config/auth'),
    xoauth2 = require('xoauth2');

let AuthController = 
{
	// ============================
	// 			HOME PAGE 
	// ============================
	home: function(req, res) {
		res.render('index.ejs'); 
	},

	// ============================
	// 			LOGIN 
	// ============================
	getLogin: function(req, res) {

		res.render('login.ejs', { message: req.flash('loginMessage') });
	},

	postLogin: function(req, res){passport.authenticate('local-login', {
		successRedirect : '/profile', 
		failureRedirect : '/login', 
		failureFlash : true 
	})(req, res);},

	// ============================
	//           SIGNUP 
	// ============================
	getSignup: function(req, res) {
		res.render('signup.ejs', { message: req.flash('signupMessage') });
	},

	postSignup: function(req, res){passport.authenticate('local-signup', {
		successRedirect : '/profile', 
		failureRedirect : '/signup', 
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
			res.render('user_profile.ejs', {
			user : req.user // get the user out of session and pass to template
			});
			}
			else if(req.user.user_type == 2)  // business
			{
				res.render('business_profile.ejs', {
				user : req.user // get the user out of session and pass to template
				});
			}
			else if(req.user.user_type == 3)  // admin
			{
				res.render('admin_profile.ejs', {
				user : req.user // get the user out of session and pass to template
				});
			}	
		}
		else
			res.redirect('/');
	},

	// =====================================
	// 				LOGOUT 
	// =====================================
	logout: function(req, res) {
		req.logout();
		res.redirect('/');
	},

	// =====================================
	// 				FACEBOOK 
	// =====================================
	facebookLogin   : function(req, res){
		passport.authenticate('facebook', { scope : 'email' })(req, res);},

	facebookCallback: function(req, res){
		passport.authenticate('facebook', {
            						successRedirect : '/profile',
            						failureRedirect : '/'
       							   })(req, res);
								},
									
	// =====================================
	// 				GOOGLE 
	// =====================================
	googleLogin : function(req, res){
		passport.authenticate('google', { scope : ['profile', 'email'] })(req, res);
	},

	googleCallback: function(req, res){
		passport.authenticate('google', { failureRedirect: '/', successRedirect :'http://localhost:8080/profile'})(req, res);
	},

	// =====================================
	// 		     FORGOT PASSWORD 
	// =====================================
	getForgetPassword: function(req, res){
		res.render('frogetPassword.ejs');
	},

	forgotPassword: function(req, res, next) {
  		async.waterfall([
    	function(done) {
      	crypto.randomBytes(20, function(err, buf) {
        	var token = buf.toString('hex');
        	done(err, token);
        	console.log("hena 1");
    	  });
   		},
    	function(token, done) {
      		User.findOne({ email: req.body.email }, function(err, user) {
        	if (!user) {
          	console.log('error', 'No account with that email address exists.');
          	return res.redirect('/forgot');
        	}

        	user.local.resetPasswordToken = token;
        	user.local.resetPasswordExpires = Date.now() + 3600000; // 1 hour
        	console.log("user"+user);
        	console.log(user.local.resetPasswordToken );
        	console.log(user.local.resetPasswordExpires);
        	console.log("token"+token);
        	user.save(function(err) {
        		if(err)
        		console.log(err);
          	done(err, token, user);
        	});
      		});
    	},
    	function(token, user, done) {
    		
    
        // login
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
      });

        var mailOptions = {
        	to: user.email,
        	from: 'fasa7ny.team@gmail.com',
        	subject: 'Fasa7ny Password Reset',
        	text: 'You are receiving this because you (or someone else) have requested the reset of the password for your account.\n\n' +
          	'Please click on the following link, or paste this into your browser to complete the process:\n\n' +
          	'http://' + req.headers.host + '/reset/' + token + '\n\n' +
          	'If you did not request this, please ignore this email and your password will remain unchanged.\n'
     		};
     	
      	smtpTransport.sendMail(mailOptions, function(err) {
      			if(err)
      				console.log("error");
        	req.flash('info', 'An e-mail has been sent to ' + user.email + ' with further instructions.');
       		done(err, 'done');
      	});
    	}
  		], function(err) {
    	if (err) return next(err);
    	res.redirect('/');
  	  });
	},

	getReset: function(req, res) {
 	 User.findOne({ "local.resetPasswordToken": req.params.token, "local.resetPasswordExpires": { $gt: Date.now() } }, function(err, user) {
   	 if (!user) {
      req.flash('error', 'Password reset token is invalid or has expired.');
      return res.redirect('/forgot');
    	}
    	res.render('reset', {
      	user: req.user,
      	token: req.params.token
    	});
  	  });
	},

	postReset: function(req, res) {
  async.waterfall([
    function(done) {
      User.findOne({ "local.resetPasswordToken": req.params.token, "local.resetPasswordExpires": { $gt: Date.now() } }, function(err, user) {
        if (!user) {
          req.flash('error', 'Password reset token is invalid or has expired.');
          return res.redirect('back');
        }

        user.password = req.body.password;
        user.resetPasswordToken = undefined;
        user.resetPasswordExpires = undefined;

        user.save(function(err) {
          req.logIn(user, function(err) {
            done(err, user);
          });
        });
      });
    },
   
    function(user, done) {
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
      });
      var mailOptions = {
        to: user.email,
        from: 'passwordreset@demo.com',
        subject: 'Your password has been changed',
        text: 'Hello,\n\n' +
          'This is a confirmation that the password for your account ' + user.email + ' has just been changed.\n'
      };
      smtpTransport.sendMail(mailOptions, function(err) {
        req.flash('success', 'Success! Your password has been changed.');
        done(err);
      });
    }
  ], function(err) {
    res.redirect('/');
  });
},


}

module.exports = AuthController;



