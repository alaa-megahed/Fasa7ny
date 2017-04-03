var mongoose = require('mongoose');
var User = mongoose.model('RegisteredUser');
var Business = mongoose.model('Business');
var Rating = mongoose.model('Rating');


exports.subscribe = function(req,res)
{
	// if(user) {
		var userID = req.body.id;              // from passport session
		var businessID = req.body.business;        // from url parameters
		var subscribed_business;
		User.findOne({_id: userID}, function(err, user_found)
		{
			if(err) {
				console.log("Error in findOne() of subscribe-user");
				throw err;
			}

			Business.findOne({_id: businessID}, function(err, business)
			{
			    if(err) {
					console.log("Error in findOne() of subscribe-business");
					throw err;
				}
				if(!business) {
					console.log("Business not found.")
				}

				if (user_found) {
					console.log("Updating user-subscriptions & business-subscribers..");
					business.subscribers.push(user_found);
					business.save();
					user_found.subscriptions.push(business);
					user_found.save();
					//Business.update({business_ID: businessID}, {$push: { subscribers: user_found }});
				}
				else {
					console.log("User is not found.");
				}
			});

			res.send("successful");

		});
	//}
	// else {
	// 	console.log("Must login to subscribe.");
	// 	//res.redirect('/routes/login');
	// }

}

exports.unsubscribe = function(req,res)
{
	var userID = req.body.id;              // from passport session
    var businessID = req.body.business;        // from url parameters
    var subscribed_business;
    User.findOne({_id: userID}, function(err, user_found)
    {
		if(err) {
			console.log("Error in findOne() of unsubscribe-user");
			throw err;
		}

		Business.findOne({_id: businessID}, function(err, business)
		{
		    if(err) {
				console.log("Error in findOne() of unsubscribe-business");
				throw err;
			}
			if(!business) {
				console.log("Business not found.")
			}

			if (user_found) {
				console.log("Updating user-subscriptions & business-subscribers..");
				business.subscribers.pull(user_found);
				business.save();
				user_found.subscriptions.pull(business);
				user_found.save();
			}
			else {
				console.log("User is not found.");
			}

		});

		res.send("successful unsubscription");

    });

}

exports.addRating = function(req, res)
{
	// if(user) {
			var userID = req.body.id;              // from passport session; changed to body temporarily for testing
	    var businessID = req.body.business;        // from url parameters; changed from param to body
	    var rating2 = req.body.rating;		   // from post body
	    var rating_query = {user_ID: userID, business_ID: businessID};

	    Rating.findOne(rating_query, function(err, previous_rating)
	    {
	    	if(err) {
	    		console.log("Error in findOne() of rating");
	    		throw err;
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

	    	module.exports.average_rating(req,res);    // NOT SURE IF IT WILL WORK!

				res.send("successful rating");
	    });
	//}
	// else {
	// 	console.log("Must login to rate");
	// 	//res.redirect('/routes/login');
	// }


};

exports.average_rating = function(req,res)
{
    var businessID = req.body.business;       // from url parameters

    // Rating.find({business_ID: businessID}, {rating: true}, function(err, ratings) {
		// 	console.log("ratings are " + ratings);
    // 	var sum = ratings.reduce((accumulator, current) => accumulator + current.rating, 0);
    // 	var avg = sum / ratings.length;
    // 	Business.update({_id: businessID}, {$set: { average_rating: avg }});
    // 	console.log(avg);
    // });

		Rating.find({}, function(err,ratings){ //this exists mainly to postpone the function
			//console.log(ratings);
			Rating.aggregate([
					{ $match : { business_ID : new mongoose.Types.ObjectId(businessID)} } ,
	        {$group: {_id : '$business_ID', average: {$avg: '$rating'}}}
	    ], function (err, result) {
				if(err)
					throw err;
				else {
					console.log(result);
					Business.findByIdAndUpdate(businessID, {average_rating:result[0].average}, function(err, business){
					});
				}
			});

		 })




}


exports.customize = function(req,res)
{
	var userID = req.body.id;              // from passport session
    var businessID = req.body.business;        // from url parameters

	User.findOne({_id: userID}, function(err, user_found) 
	{
	    if(err) {
			console.log("Error in findOne() of customize");
			throw err;
		}
		if(!user_found) {
			console.log("User not found.")
		}
		else {
			console.log(user_found.bookings);
			console.log(user_found.subscriptions);
		}
	});
}
