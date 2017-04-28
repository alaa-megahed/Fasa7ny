var mongoose = require('mongoose');
var User = mongoose.model('RegisteredUser');
var Booking = mongoose.model('Booking');
var Event = mongoose.model('Events');
var EventOccurrence = mongoose.model('EventOccurrences');
var Business = mongoose.model('Business');
var Rating = mongoose.model('Rating');
var statsController = require('../controllers/stats.controller');



exports.getUserDetails = function (req, res) {
	var user_id = req.params.id;

	User.findById(user_id, function (err, user) {
		if (err)
			console.log("error in finding user");
		else {
			//console.log(user);
			res.json({ user: user });
		}
	});
}


exports.getBookingDetails = function (req, res) {
	if (req.user && req.user instanceof User) {
		var user_id = req.user.id;
		var booking_id = req.params.booking;
		//console.log("This is the booking id in user controller :"+ booking_id);

		Booking.findById(booking_id, function (err, booking) {
			if (err)
				console.log("error in finding booking");
			else {
				//console.log("This is booking in node "+ booking);
				if (booking) {
					EventOccurrence.findById(booking.event_id, function (err, eventocc) {
						if (err)
							return res.status(500).json("Something went wrong");
						else {
							if (eventocc) {
								Event.findById(eventocc.event, function (err, event) {
									if (err)
										return res.status(500).json("Something went wrong");
									else {
										if (event) {
											Business.findById(event.business_id, function (err, business) {
												if (err)
													return res.status(500).json("Something went wrong");
												else {
													// console.log(booking);
													// console.log(eventocc);
													return res.status(200).json({ booking: booking, eventocc: eventocc, event: event, business: business });
												}
											});
										}

									}

								});

							}
						}
					});
				}
			}
		});
	}
	else {
		return res.status(500).json("You are not a logged in user");
	}
}



exports.getSubscribedBusiness = function (req, res) {
	if (req.user && req.user instanceof User) {
		var user_id = req.user.id;
		var business_id = req.params.business_id;

		Business.findById(business_id, function (err, business) {
			if (err)
				return res.status(500).json("error in finding business subscription");
			else {
				//console.log("This is business in node subscriptions "+ business);
				return res.status(200).json({ business: business });
			}
		});
	}
	else {
		return res.status(500).json("You are not a logged in user");
	}
}






exports.subscribe = function (req, res) {

	console.log("subscribe " + req.user);

	if (req.user && req.user instanceof User) {
		var userID = req.user.id;

		var businessID = req.params.id;
		var subscribed_business;
		console.log("business sub");
		User.findOne({ _id: userID }, function (err, user_found) {
			if (err) {
				return res.status(500).json("Error in findOne() of subscribe-user");
			}
			var check = 0;
			for (var i = 0; i < user_found.subscriptions.length; i++) {
				if (user_found.subscriptions[i] == businessID) {
					check = 1;
					return res.status(500).json("Already subscribed");
				}
			}
			if (check == 0) {
				Business.findByIdAndUpdate(businessID, { $push: { "subscribers": user_found } }, { safe: true, upsert: true, new: true },
					function (err, business) {
						if (err)
							res.status(500).json("Something went wrong. Please try again.");
						else {

							user_found.subscriptions.push(businessID);
							user_found.save();
							//count subscription in stats
							var now = new Date();
							now.setHours(0, 0, 0, 0);
							statsController.addStat(now, businessID, 'subscriptions', 1);
							return res.status(200).json("business has been added to subscriptions.");
						}

					});
			}


		});

	}
	else res.status(500).json("You are not logged in");
}

exports.unsubscribe = function (req, res) {

	if (req.user && req.user instanceof User) {
		var userID = req.user.id;

		var businessID = req.params.id;
		var subscribed_business;
		console.log("business unsub");
		User.findOne({ _id: userID }, function (err, user_found) {
			if (err) {
				res.status(500).json("Error in findOne() of unsubscribe-user");
				return;
			}

			var check = 0;
			for (var i = 0; i < user_found.subscriptions.length; i++) {
				if (user_found.subscriptions[i] == businessID)
					check = 1;
			}
			if (check == 1) {
				Business.findOne({ _id: businessID }, function (err, business) {
					if (err || !business) {
						res.status(500).json("Error in finding business.");
						return;
					}

					if (user_found) {
						business.subscribers.pull(user_found);
						business.save();
						user_found.subscriptions.pull(business);
						user_found.save();
						var now = new Date();
						now.setHours(0, 0, 0, 0);
						statsController.addStat(now, businessID, 'subscriptions', -1);

						res.status(200).json("business has been removed from subscriptions.");
						return;
					}
					else {
						res.status(500).json("User is not found.");
						return;
					}

				});
			}
			else {
				return res.status(500).json("Not subscribed");
			}




		});
	}
	else {
		res.status(500).json("You are not logged in");
	}

}



exports.addRating = function(req, res)
{
	console.log(req.user);
	 if(req.user && req.user instanceof User) {

		var userID = req.user.id;              // from passport session; changed to body temporarily for testing
		var businessID = req.params.bid;        // from url parameters; changed from param to body
		var rating2 = req.params.rate;		   // from post body
		console.log("entered addRating");
		var rating_query = { user_ID: userID, business_ID: businessID };

		Rating.findOne(rating_query, function (err, previous_rating) {
			if (err) {
				res.status(500).json("Error in finding rating");
				return;
			}

			if (previous_rating) {
				console.log("previous_rating");
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
		res.status(500).json("You are not logged in");
	}
};

exports.average_rating = function (req, res) {
	console.log("entered average_rating");
	var businessID = req.params.bid;

	Rating.find({ business_ID: businessID }, function (err, ratings) { //this exists mainly to postpone the function
		Rating.aggregate([{ $group: { _id: '$business_ID', average: { $avg: '$rating' } } }],
			function (err, result) {
				if (err) {
					res.status(500).json("Error. Please retry.");
					return;
				}
				else {
					Business.findByIdAndUpdate(businessID, { $set: { average_rating: result[0].average } }, function (err, business) {
						if (err) {
							return res.status(500).json("Error. Please return to previous page.");
						}
						else {
							Business.findOne({ _id: businessID }, function (err, updatedBusiness) {
								if (err) console.log("error");
								else {
									console.log(updatedBusiness.average_rating);
									var now = new Date();
									now.setHours(0, 0, 0, 0);
									statsController.addStat(now, updatedBusiness._id, 'rating', updatedBusiness.average_rating);
									return res.status(200).json({ average_rating: updatedBusiness.average_rating });
								}
							})
						}
					});
				}
			});
	})
}


// exports.customize = function(req,res)
// {
// 	if(req.user && req.user instanceof User)
// 	{
// 		// return res.send("Bookings: " +  user_found.bookings + "\n Subscriptions: "  + user_found.subscriptions);
// 		return res.render('user_profile.ejs', {
//         user : req.user, bookings: req.user.bookings, subscriptions: req.user.subscriptions });

// 	}
// 	else {
// 		res.status(403).json("Please log in.");
// 		return;
// 	}

// }



/* A user can edit his personal information. He can edit name, birthdate,
phone, gender, address, email or profilePic.*/
exports.editInformation = function (req, res) {
	if (req.user && req.user instanceof User) {
		console.log("inside editInfo");
		var id = req.params.userID;
		var body = req.body;
		console.log("This is the body name: " + body.name);
		var file = req.file;
		console.log("hifile" + file);
		User.findOne({ _id: id }, function (err, user) {
			if (err)
				return res.status(500).json("error");
			else {
				if (!user)
					return res.status(500).json("user not found");
				else {
					console.log("OLDD:::");
					console.log(user);
					// console.log("This is the old birthdate:" + user.birthdate);

					// console.log("starting findOne");
					if (body.name) {
						console.log("Name in body: " + body.name);
						user.name = body.name;
					}
					if (body.birthdate && body.birthdate !== 'null') {
						console.log("Birthdate in body: " + body.birthdate);
						user.birthdate = new Date(body.birthdate);
						if (isNaN(user.birthdate.getTime())) {
							return res.status(500).json('error');
						}
					}
					if (typeof body.phone != "undefined" && body.phone.length > 0) {
						console.log("Phone in body: " + body.phone);
						user.phone = body.phone;
					}
					if (typeof body.gender != "undefined" && body.gender.length > 0)
						user.gender = body.gender;
					if (typeof body.address != "undefined" && body.address.length > 0)
						user.address = body.address;
					if (typeof body.email != "undefined" && body.email.length > 0)
						user.email = body.email;
					if (typeof file != "undefined")
						user.profilePic = file.filename;
					console.log("This is the 'unsaved' user" + user);
					user.save(function (err, updatedUser) {
						console.log("UPDATED:::");
						console.log(updatedUser);
						if (err) return res.status(500).json('error');
						return res.status(200).json({ user: updatedUser });
					});
				}
			}
		});
	} else return res.status(500).json("you are not authorized to view this page");
}


//To get notifications

exports.resetUnread = function (req, res) {
	if (req.user && req.user instanceof User) {
		User.findByIdAndUpdate(req.user.id, { unread_notifications: 0 }, function (err, user) {
			if (err)
				return res.status(500).send(err);
		});
	}
	else {
		return res.status(200).json("Unauthorized access.");
	}
}
