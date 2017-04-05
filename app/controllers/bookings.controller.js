var Booking  = require('mongoose').model('Booking');
var Events   = require('mongoose').model('Events');
var EventOccurrences   = require('mongoose').model('EventOccurrences');
var RegisteredUser     = require('mongoose').model('RegisteredUser');
//============================================<	BUSINESS>===========================================================

exports.book_event = function (req,res)
{
   // if(req.user)
  // {
	var form     = req.body;
//  var event_id = req.params.event_id; 	   // pass event id in url
	var	event_id = "58de4bc1c6e6f2e13cc833e8"; // testing


	var booking = new Booking
	({
		  booking_date : new Date(),
	    count        : form.count,
	    event_id	   : event_id
//	  booker       : req.user.id	//get business user id from session?
	});

	booking.save(function(err,booking)
	{
		if(err)
		{
			console.log("error in business saving booking "+booking);
		}
		else
		{
			console.log("saved "+ booking);


			EventOccurrences.findByIdAndUpdate(event_id,{$push: {"bookings": booking}},{safe: true, upsert: true, new : true},
		        function(err, eventocc)
		        {
		        	if(err)
		            console.log(err);
		        	else
		        	{
		        		console.log(eventocc);
		        		eventocc.available = eventocc.available - booking.count;
		          	eventocc.save();

		        	}
		        }
		    );

		}

	});

	res.send("khalaweess");
	// }
  // else
  // {
  //   res.send("Please log in to add bookings");
  // }
}

exports.edit_booking = function(req,res)
{
	 // if(req.user)
  // {
//	var bookingID    = req.params.id;        		//id of booking to be edited should be passed in the url or body
	var bookingID    = "58e14564de21c3446730b843"; 	//for testing

	var new_date 	 = new Date();
	var count 		 = req.body.count1;

	Booking.findByIdAndUpdate(bookingID,{$set:{'booking_date':new_date,'count':count}},
	function(err,booking)
	{
		if(err)
			console.log("error editing booking");
		else
		{

			var old = booking.count;
			booking.count = count;

			console.log("successfully edited "+count+" "+old);

			EventOccurrences.findById(booking.event_id, //{$set:{'count':count}
		      function(err,eventocc)
		      {
		          if(err)
		          	console.log(err);
		          else
		          {
		          	eventocc.available = eventocc.available -booking.count -(-old);
		          	eventocc.save();
		          	console.log(eventocc.available);

		          }
		      });
			res.send("check database");
		}
	});

	// }
  // else
  // {
  //   res.send("Please log in to edit bookings");
  // }

}

exports.cancel_booking = function(req,res)
{
	// if(req.user)
  // {
//	var bookingID = req.params.id;        //id of booking to be cancelled should be passed in the url or body
//  var event_id  = req.params.id 		  //event_id of booking to be cancelled should be passed in the url or body or we need to findOne
	var bookingID = "58de5cbf9b286d30f8c1d9a0";  //for testing
	var event_id  = "58de4bc1c6e6f2e13cc833e8";  //for testing

	Booking.findByIdAndRemove(bookingID,function(err,booking)
	{
		if(err)
			console.log("error cancel booking");
		else
		{
			console.log("successfully cancelled "+ booking);

			EventOccurrences.findByIdAndUpdate(event_id,{ $pull: {bookings: bookingID}},
		      function(err,eventocc)
		      {
		          if(err)
		          	console.log(err);
		          else
		          {
		          	eventocc.available = eventocc.available + booking.count;
		          	eventocc.save();
		          }
		      });

			res.send('el mafrood deleted');
		}

	});

// }
  // else
  // {
  //   res.send("Please log in to cancel bookings");
  // }

}

exports.view_event_bookings = function(req,res)
{
	// if(req.user)
  // {

//  var event_id  = req.params.id 		  		 //event_id  should be passed in the url or body
	var event_id  = "58de4bc1c6e6f2e13cc833e8";  //for testing

	EventOccurrences.findOne({_id:event_id}).populate('bookings').exec(function(err,bookings)
	{
		console.log(bookings);
		res.send(bookings);
	});
	// }
  // else
  // {
  //   res.send("Please log in to cancel bookings");
  // }
}





//============================================<	USER >===========================================================

//Registered User adds bookings by giving count, event id. Booking date is saved as current date.
exports.regUserAddBooking = function(req, res, next) {

  if(req.user)
  {
		if(req.user instanceof RegisteredUser)
		{
			if(!req.body.count || !req.body.event)
			{
				res.send("Please fill in all required elements.");
				return;
			}


			if(isNaN(req.body.count))
			{
				res.send("Enter a number in the count field.");
				return;
			}


			var date = new Date();
	    var booking = new Booking(
	      {
	        count        : req.body.count,
	        booker       : req.user.id,
	        event_id     : req.body.event,
	        booking_date : date
	      });

	    booking.save(function(err,booking)
			 {
	        if (!err)
					{
						//decreases capacity of event occurence and stores booking in event occurence's list of bookings
						 EventOccurrences.findOne({_id:req.body.event},  function(err,eve)
						 {
								if(err || !eve )
								{
									res.send("Error adding booking. Please try again!");
									return;
								}
								else
								{
									eve.available = eve.available - req.body.count;
									if(eve.available < 0)
									{
										res.send("Not enough spaces - please decrease count of booking.");
										return;
									}
									else
									{
											eve.bookings.push(booking);
											eve.save();
									}

									//finds registered user and adds this event to his/her list of bookings
									RegisteredUser.findOne({_id:req.user.id}, function(err, user)
								 {
									 if(err || !user)
									 {
										 res.send("Error saving booking. Please try again.");
										 return;
									 }
									 else {
										 user.bookings.push(booking);
										 user.save();
										 res.send("successful booking");
										 return;
										 }

								 });

								}
						 });






	        }
	        else
					{
						res.send("Error. Please try again.");
	        }
	    });
	  }
		else
		{
			res.send("You are not a registered user");
		}


	}
	else
	{
		res.send("Please log in to book events");
  }


};

//Registered user views booking using his/her id
exports.regUserViewBookings = function(req,res,next){

  if(req.user)
  {
		if(req.user instanceof RegisteredUser)
		{
			RegisteredUser.findOne({_id:req.user.id}).populate('bookings').exec(function(err, bookings)
			{
				if(err)
					res.send("Error finding bookings");
				else
					res.send(bookings.bookings);


	    });
		}
		else
		{
			res.send("You are not a registered user.");
		}

 }
 else
  {
    res.send("Please log in to view upcoming bookings.");
  }

};


//Registered user can edit his/her bookings
exports.regUserEditBookings = function(req,res,next){

  if(req.user)
  {
		if(req.user instanceof RegisteredUser)
		{
			Booking.findById(req.body.bookingE, function(err,booking)
			{
				if(err || !booking)
					res.send("Error editing booking");
				else
				{
					if(booking.booker == req.user.id)
					{
						//updates available places
						EventOccurrences.findOne(booking.event_id, function(err, eve)
						{
							eve.available = eve.available + booking.count - req.body.count;
							if(eve.available < 0)
								res.send("Invalid amount. Please try again.");
							else
							{
								eve.save();
								booking.count = req.body.count;
								booking.save();
								res.send("successful edit");
							}


						});
					}
					else
					{
						res.send("Not one of your bookings.");
					}


				}


	    });


		}
		else
		{
			res.send("You are not a registered user.");
		}

  }
  else
  {
    res.send("Please log in to edit bookings");
  }

}

//Registered User deletes bookings
exports.regUserDeleteBookings = function(req,res,next){

  if(req.user)
  {
		if(req.user instanceof RegisteredUser)
		{
			Booking.findByIdAndRemove(req.body.bookingD, function(err,booking)
			{

				if(err || !booking)
					res.send("Error deleting booking. Please recheck information and try again.");
				else
				{
					if(booking.booker == req.user.id)
					{
						if(err) throw err;
						RegisteredUser.findByIdAndUpdate(req.user.id, {"$pull" : {bookings: req.body.booking}}, function(err,user){
							if(err) throw err;
						})
						EventOccurrences.findByIdAndUpdate(booking.event_id, {"$pull" : {bookings: req.body.booking}}, function(err,eve){
							if(err) throw err;
							eve.available = eve.available + booking.count;
							eve.save();
							res.send(booking);
						})

					}
					else
					{
						res.send("Not one of your bookings.");
					}
				}



			});
		}
		else
		{
			res.send("Not a registered user.");
		}

  }
  else
  {
    res.send("Please log in to delete bookings");
  }

}
