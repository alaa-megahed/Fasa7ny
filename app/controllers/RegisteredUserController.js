var mongoose = require('mongoose');
var User = mongoose.model('RegisteredUser');
var Business = mongoose.model('Business');
var Rating = mongoose.model('Rating');


exports.subscribe = function (req, res) {
	if (req.user && req.user instanceof User) {
		var userID = req.user.id;
		var businessID = req.body.business;
		var subscribed_business;
		User.findOne({ _id: userID }, function (err, user_found) {
			if (err) {
				res.send("Error in findOne() of subscribe-user");
				return;

			}


			Business.findByIdAndUpdate(businessID, { $push: { "subscribers": user_found } }, { safe: true, upsert: true, new: true },
				function (err, business) {
					if (err)
						res.send("Something went wrong. Please try again.");
					else {
						if (user_found) {
							user_found.subscriptions.push(business);
							user_found.save();
							res.send("business has been added to subscriptions.");
						}
					}
				});
		});
	}
	else {
		res.redirect('/auth/login');
	}
}


exports.unsubscribe = function (req, res) {
	if (req.user && req.user instanceof User) {
		var userID = req.user.id;
		var businessID = req.body.business;
		var subscribed_business;
		User.findOne({ _id: userID }, function (err, user_found) {
			if (err) {
				res.send("Error in findOne() of unsubscribe-user");
				return;
			}

			Business.findOne({ _id: businessID }, function (err, business) {
				if (err || !business) {
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
		res.redirect('/auth/login');
	}
}


exports.addRating = function (req, res) {

	if (req.user && req.user instanceof User) {

		var userID = req.user.id;              // from passport session; changed to body temporarily for testing
		var businessID = req.body.business;        // from url parameters; changed from param to body
		var rating2 = req.body.rating;		   // from post body
		var rating_query = { user_ID: userID, business_ID: businessID };

		Rating.findOne(rating_query, function (err, previous_rating) {
			if (err) {
				res.send("Error in finding rating");
				return;
			}

			if (previous_rating) {
				previous_rating.rating = rating2;
				previous_rating.save();
			}

			else {
				var rating1 = new Rating(
					{
						user_ID: userID,
						business_ID: businessID,
						rating: rating2
					});

				rating1.save();
			}

			module.exports.average_rating(req, res);


		});
	}
	else {
		res.redirect('/auth/login');
	}
};

exports.average_rating = function (req, res) {
	var businessID = req.body.business;

	Rating.find({ business_ID: businessID }, function (err, ratings) { //this exists mainly to postpone the function
		Rating.aggregate([{ $group: { _id: '$business_ID', average: { $avg: '$rating' } } }],
			function (err, result) {
				if (err) {
					res.send("Error. Please retry.");
					return;
				}
				else {
					Business.findByIdAndUpdate(businessID, { $set: { average_rating: result[0].average } }, function (err, business) {
						if (err) {
							return res.send("Error. Please return to previous page.");
						}
						else {
							return res.send("rating successfully added");
						}
					});
				}
			});
	})
}


exports.customize = function (req, res) {
	if (req.user && req.user instanceof User) {
		// return res.send("Bookings: " +  user_found.bookings + "\n Subscriptions: "  + user_found.subscriptions);
		return res.render('user_profile.ejs', {
			user: req.user, bookings: req.user.bookings, subscriptions: req.user.subscriptions
		});

	}
	else {
		res.send("Please log in.");
		return;
	}

}



/* A user can edit his personal information. He can edit name, birthdate,
phone, gender, address, email or profilePic.*/
exports.editInformation = function (req, res) {
	if (req.user && req.user instanceof User) {
		var id = req.user.id;
		var body = req.body;
		var file = req.file;

		User.findOne({ _id: id }, function (err, user) {
			if (err) res.send("error");
			else {
				if (!user) res.send("user not found");
				else {
					if (typeof body.name != "undefined" && body.name.length > 0) user.name = body.name;
					if (typeof body.birthdate != "undefined" && body.birthdate.length > 0) user.birthdate = new Date(body.birthdate);
					if (typeof body.phone != "undefined" && body.phone.length > 0) user.phone = body.phone;
					if (typeof body.gender != "undefined" && body.gender.length > 0) user.gender = body.gender;
					if (typeof body.address != "undefined" && body.address.length > 0) user.address = body.address;
					if (typeof body.email != "undefined" && body.email.length > 0) user.email = body.email;
					if (typeof file != "undefined") user.profilePic = file.filename;

					user.save(function (err, updateduser) {
						if (err) res.send("error in saving the user");
						else if (!updateduser) res.send("user does not exist");
						else res.send(updateduser);
					});
				}
			}
		});
	} else res.send("you are not authorized to view this page");
}
