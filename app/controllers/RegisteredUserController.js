var User = require('mongoose').model('RegisteredUser');
var Business = require('mongoose').model('Business');

var ratings    = require('../controller/RatingsController');

exports.rate = function(req,res)
{
	ratings.addRating;   // NOT SURE!

}

exports.subscribe = function(req,res)
{
	if(user) {
		var userID = req.user.id;              // from passport session
		var businessID = req.params.id;        // from url parameters
		var subscribed_business;
		User.findOne({user_ID: userID}, function(err, user_found) 
		{
			if(err) {
				console.log("Error in findOne() of subscribe-user");
				throw err;
			}

			Business.findOne({business_ID: businessID}, function(err, business) 
			{
			    if(err) {
					console.log("Error in findOne() of subscribe-business");
					throw err;
				}
				if(!business) {
					console.log("Business not found.")
				}
				else {
					subscribed_business = business;
				}
			});

			if (user_found) {
				console.log("Updating user-subscriptions & business-subscribers..");
				User.update({user_ID: userID}, {$push: { subscriptions: subscribed_business }});
				Business.update({business_ID: businessID}, {$push: { subscribers: user_found }});
			}
			else {
				console.log("User is not found.");
			}
		});
	}
	else {
		console.log("Must login to subscribe.");
		//res.redirect('/routes/login');
	}

}

exports.unsubscribe = function(req,res)
{
	var userID = req.user.id;              // from passport session
    var businessID = req.params.id;        // from url parameters
    var subscribed_business;
    User.findOne({user_ID: userID}, function(err, user_found) 
    {
		if(err) {
			console.log("Error in findOne() of unsubscribe-user");
			throw err;
		}

		Business.findOne({business_ID: businessID}, function(err, business) 
		{
		    if(err) {
				console.log("Error in findOne() of unsubscribe-business");
				throw err;
			}
			if(!business) {
				console.log("Business not found.")
			}
			else {
				subscribed_business = business;
			}
		});

		if (user_found) {
			console.log("Updating user-subscriptions & business-subscribers..");
			User.update({user_ID: userID}, {$pull: { subscriptions: subscribed_business }});
			Business.update({business_ID: businessID}, {$pull: { subscribers: user_found }});
		}
		else {
			console.log("User is not found.");
		}
    });
}


/* exports.customize = function(req,res)    // --> still working on it 
{
	var userID = req.user.id;              // from passport session
    var businessID = req.params.id;        // from url parameters

    Rating.find({business_ID: businessID}, {rating: true}).toArray(function(err, ratings) {
		var sum = ratings.reduce((accumulator, current) => accumulator + current.rating, 0);
		var avg = sum / ratings.length;
		Business.update({business_ID: businessID}, {$set: { average_rating: avg }});
		console.log(avg);
    }); 


} */
