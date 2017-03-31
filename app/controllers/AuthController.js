var passport = require('passport');

let AuthController = 
{
	// ============================
	// 			HOME PAGE 
	// ============================
	home: function(req, res) {
		// res.render('index.ejs'); 
	},

	// ============================
	// 			LOGIN 
	// ============================
	getLogin: function(req, res) {

		// render the page and pass in any flash data if it exists
		// res.render('login.ejs', { message: req.flash('loginMessage') });
	},

	postLogin: function(){passport.authenticate('local-login', {
		// successRedirect : '/profile', // redirect to the secure profile section
		// failureRedirect : '/login', // redirect back to the signup page if there is an error
		// failureFlash : true // allow flash messages
	})},

	// ============================
	//           SIGNUP 
	// ============================
	getSignup: function(req, res) {

		// render the page and pass in any flash data if it exists
		// res.render('signup.ejs', { message: req.flash('signupMessage') });
	},

	postSignup: function(){passport.authenticate('local-signup', {
		// successRedirect : '/profile', // redirect to the secure profile section
		// failureRedirect : '/signup', // redirect back to the signup page if there is an error
		// failureFlash : true // allow flash messages
	})},

	// ============================
	// 	    PROFILE SECTION 
	// ============================
	getProfile: function(req, res){
		if (req.isAuthenticated())
		{
			if(req.user.user_type == 1)       // regular user
			{
			// res.render('user_profile.ejs', {
			// user : req.user // get the user out of session and pass to template
			// });
			}
			else if(req.user.user_type == 2)  // business
			{
				// res.render('business_profile.ejs', {
				// user : req.user // get the user out of session and pass to template
				// });
			}
			else if(req.user.user_type == 3)  // admin
			{
				// res.render('admin_profile.ejs', {
				// user : req.user // get the user out of session and pass to template
				// });
			}	
		}
		else
			// res.redirect('/');
	},

	// =====================================
	// 				LOGOUT 
	// =====================================
	logout: function(req, res) {
		req.logout();
		// res.redirect('/');
	},
}

module.exports = AuthController;



