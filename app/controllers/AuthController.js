var passport = require('passport');

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
	}	

}

module.exports = AuthController;



