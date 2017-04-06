var mongoose = require('mongoose');
var User = mongoose.model('RegisteredUser');
var Business = mongoose.model('Business');
var Rating = mongoose.model('Rating');


exports.subscribe = function(req,res)
{
	if(req.user && req.user instanceof User) {
		var userID = req.user.id;
		var businessID = req.body.business;
		var subscribed_business;
		User.findOne({_id: userID}, function(err, user_found)
		{
			if(err) {
				res.send("Error in findOne() of subscribe-user");
				return;

			}


			Business.findByIdAndUpdate(businessID,{$push: {"subscribers" : user_found}},{safe: true, upsert: true, new : true},
			function(err, business)
			{
				if(err)
					res.send("Something went wrong. Please try again.");
				else {
					if (user_found) {
						console.log("Updating user-subscriptions & business-subscribers..");
						user_found.subscriptions.push(business);
						user_found.save();
						res.send("business has been added to subscriptions.");
				}
			}
		 });
		});
	}
	else {
	 	console.log("Must be logged in to subscribe");
		res.redirect('/auth/login');
    }
}


exports.unsubscribe = function(req,res)
{
	if(req.user && req.user instanceof User) {
		var userID = req.user.id;
	    var businessID = req.body.business;
	    var subscribed_business;
	    User.findOne({_id: userID}, function(err, user_found)
	    {
			if(err) {
				res.send("Error in findOne() of unsubscribe-user");
				return;
			}

			Business.findOne({_id: businessID}, function(err, business)
			{
			    if(err || !business) {
					res.send("Error in finding business.");
					return;
				}

				if (user_found) {
					business.subscribers.pull(user_found);
					business.save();
					user_found.subscriptions.pull(business);
					user_found.save();
					res.send("business has been removed from subscriptions.");
					return;
				}
				else {
					res.send("User is not found.");
					return;
				}

			});



	    });
	}
	else {
		 console.log("Must be logged in to unsubscribe.");
		res.redirect('/auth/login');
	}
}


exports.addRating = function(req, res)
{

	 if(req.user && req.user instanceof User) {

		var userID = req.user.id;              // from passport session; changed to body temporarily for testing
	    var businessID = req.body.business;        // from url parameters; changed from param to body
	    var rating2 = req.body.rating;		   // from post body
	    var rating_query = {user_ID: userID, business_ID: businessID};

	    Rating.findOne(rating_query, function(err, previous_rating)
	    {
	    	if(err) {
	    		res.send("Error in findOne() of rating");
	    		return;
	    	}

	    	if (previous_rating) {
	    		console.log("Found previous rating. Updating it..");
	    		previous_rating.rating = rating2;
					previous_rating.save();
	    	}

	    	else {
	    		console.log("No previous rating. Inserting new rating..");
	    		var rating1 = new Rating(
				  {
						user_ID: userID,
						business_ID: businessID,
					  rating: rating2
				  });

					rating1.save();
	    	}

	    	module.exports.average_rating(req,res);

				res.send("rating successfully added");
	    });
	}
	else {
	 	console.log("Must be logged in to rate.");
	 	res.redirect('/auth/login');
    }
};

exports.average_rating = function(req,res)
{
    var businessID = req.body.business;

	Rating.find({business_ID:businessID}, function(err,ratings) { //this exists mainly to postpone the function
		console.log(ratings);
		Rating.aggregate([{$group: {_id : '$business_ID', average: {$avg: '$rating'}}}],
        function (err, result) {
			if(err)
				{
					res.send("Error. Please retry.");
					return;
				}
			else {
				console.log(result);
				Business.findByIdAndUpdate(businessID,{$set:{average_rating:result[0].average}},function(err, business){
					if(err)
					{
						res.send("Error. Please return to previous page.");
					}
					else
						console.log(business);
				});
			}
		});
	 })
}


exports.customize = function(req,res)
{
	if(req.user && req.user instanceof User)
	{
		var userID = req.user.id;              // from passport session

		User.findOne({_id: userID}, function(err, user_found)
		{
		    if(err) {
				console.log("Error in findOne() of customize");
				res.send("Error. Please retry.");
			}
			if(!user_found) {
				console.log("User not found.")
			}
			else {
				res.send("Bookings: " +  user_found.bookings + "\n Subscriptions: "  + user_found.subscriptions);

			}
		});
	}
	else {
		res.send("Please log in.");
	}

}



/* A user can edit his personal information. He can edit name, username
(the username must be unique,so if he used username that already exists the user
will be notified), birthdate, phone, gender, address, email or profilePic.*/
exports.editInformation = function(req, res) {
	if(req.user && req.user instanceof User) {
		var id = req.user.id;
		// var id = req.body.id; //just for testing
		// var s = req.body;

		if(typeof s.name != "undefined" && s.name.length > 0) {
			User.findByIdAndUpdate(id, {$set:{name:s.name}}, function(err, user) {
				if(err) {
					console.log("cannot update user's name");
				} else {
					console.log("user's name updated");
					console.log(user);
				}
			});
		}

		if(typeof s.username != "undefined" && s.username.length > 0) {
			User.findOne({username:s.username}, function(err, user) {
				if(err) {
					console.log("error in finding user having the same username");
				} else {
					if(!user) {
						User.findByIdAndUpdate(id, {$set: {username:s.username}}, function(err, userupdated) {
							if(err) {
								console.log("error in updating user's username");
							} else {
								console.log("user's username updated");
								console.log(userupdated);
							}
						})
					} else {
						console.log(user);
						console.log("username already exists, choose another name");
					}
				}
			})
		}

		if(typeof s.birthdate != "undefined") {
			User.findByIdAndUpdate(id, {$set: {birthdate:new Date(s.birthdate)}}, function(err, user) {
				if(err) {
					console.log("cannot update user's birthdate");
				} else {
					console.log("user's birthdate updated");
					console.log(user);
				}
			})
		}

		if(typeof s.phone != "undefined" && s.phone.length > 0) {
			User.findByIdAndUpdate(id, {$set: {phone:s.phone}}, function(err, user) {
				if(err) {
					console.log("cannot update user's phone");
				} else {
					console.log("user's phone update");
					console.log(user);
				}
			})
		}

		if(typeof s.gender != "undefined" && s.gender.length > 0) {
			User.findByIdAndUpdate(id, {$set: {gender: s.gender}}, function(err, user) {
				if(err) {
					console.log("cannot update user's gender");
				} else {
					console.log("user's gender updated");
					console.log(user);
				}
			})
		}

		if(typeof s.address != "undefined" && s.address.length > 0) {
			User.findByIdAndUpdate(id, {$set: {address:s.address}}, function(err, user) {
				if(err) {
					console.log("cannot update user's location");
				}  else {
					console.log("user's location updated");
					console.log(user);
				}
			})
		}

		if(typeof s.email != "undefined" && s.email.length > 0) {
			User.findByIdAndUpdate(id,{$set: {email:s.email}}, function(err, user) {
				if(err) {
					console.log("cannot update user's email");
				} else {
					console.log("user's location updated");
					console.log(user);
				}
			})
		}

		if(typeof f != "undefined") {
			User.findByIdAndUpdate(id, {$set: {profilePic: f.filename}}, function(err, user) {
				if(err){
					console.log("cannot change user's profilePic");
				} else {
					console.log("user's profilePic updated");
					console.log(user);
				}
			})
		}
	}
}






//
