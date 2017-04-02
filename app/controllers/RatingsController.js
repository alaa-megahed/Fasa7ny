var Rating = require('mongoose').model('Rating');
var reg_users  = require('../controllers/RegisteredUserController');

exports.addRating = function(req, res)
{
	if(user) {
			var userID = req.body.id;              // from passport session; changed to body temporarily for testing
	    var businessID = req.body.id;        // from url parameters; changed from param to body
	    var rating = req.body.rating;		   // from post body
	    var rating_query = {user_ID: userID, business_ID: businessID};

	    Rating.findOne(rating_query, function(err, previous_rating)
	    {
	    	if(err) {
	    		console.log("Error in findOne() of rating");
	    		throw err;
	    	}

	    	if (previous_rating) {
	    		console.log("Found previous rating. Updating it..");
	    		Rating.update(rating_query, {$set: { rating: rating }});
	    	}

	    	else {
	    		console.log("No previous rating. Inserting new rating..");
	    		Rating.insert(new Rating(
				  {
						user_ID: userID,
						business_ID: businessID,
					  rating: rating
				  }));
	    	}

	    	module.exports.average_rating();    // NOT SURE IF IT WILL WORK!
	    });
	}
	else {
		console.log("Must login to rate");
		//res.redirect('/routes/login');
	}


};

average_rating = function(req,res)
{
    var businessID = req.body.id;       // from url parameters

    Rating.find({business_ID: businessID}, {rating: true}).toArray(function(err, ratings) {
    	var sum = ratings.reduce((accumulator, current) => accumulator + current.rating, 0);
    	var avg = sum / ratings.length;
    	Business.update({_id: businessID}, {$set: { average_rating: avg }});
    	console.log(avg);
    });
}
