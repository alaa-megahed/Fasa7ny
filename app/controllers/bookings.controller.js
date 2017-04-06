var Booking  = require('mongoose').model('Booking');
var Events   = require('mongoose').model('Events');
var EventOccurrences = require('mongoose').model('EventOccurrences');
var RegisteredUser   = require('mongoose').model('RegisteredUser');
var Business         = require('mongoose').model('Business');


//================  < BUSINESS BOOKINGS > ====================


exports.book_event = function (req,res)
{
  //checking active session
  if(req.user && req.user instanceof Business)
  {
     var form = req.body;

     //exception handling
     if(!form.count || form.count < 1) res.send("please enter count > 1");
     else count = form.count;
     if(form.count<1) return;

    var event_id = req.body.event_id;

    //get event occurrence being booked
    EventOccurrences.findById(event_id,function(err,eventocc)
    {
        if(err || !booking)
          res.send("Oops, something went wrong, please try again with the correct information ");
        else
        {
           if(!eventocc) res.send("Oops, something went wrong, please try again with the correct information ");
          Events.findById(eventocc.event,function(err,event)
          {
              if(err || !event)
                res.send("Oops, something went wrong, please try again with the correct information ");
              else
              {
                //check if this event belongs to business currently booking it
                if(event.business_id == req.user.id)
                {
                    //cannot book more than available number
                    if(eventocc.available < count)
                    {
                       res.send("capacity doesn't allow more than "+eventocc.available);
                    }
                    else
                    {//Create booking instance
                      var booking  = new Booking
                      ({
                          booking_date : new Date(),
                          count        : count,
                          event_id     : event_id,
                          booker       : req.user.id
                      });

                      //update number of available bookings in event occurrence by subtracting
                      // the number of people in booking (count) and the available.
                      booking.save(function(err,booking)
                      {
                        var newAvailable = eventocc.available - booking.count;

                        // Insert booking in array of bookings of booked event occurrence
                        EventOccurrences.findByIdAndUpdate(event_id,{$set:{"available":newAvailable},$push: {"bookings": booking}},{safe: true, upsert: true, new : true},
                        function(err,eventoccur)
                        {
                          if(err || !eventoccur)
                            res.send("Oops, something went wrong, please try again with the correct information ");
                          else
                            res.send("Booked successfully");
                        });
                      });
                     }

                }
                else
                {
                   res.send("You do not have authority to access this page");
                }
              }
          });
        }
    });

   }
  else
  {
    res.send("Business not logged in");
  }
}

exports.edit_booking = function(req,res)
{
  //checking active session
  if(req.user && req.user instanceof Business)
  {

    //exception handling
    if(!req.body.count1 || req.body.count1 < 1) res.send("please enter count > 1");
     else newCount = req.body.count1;
    if(req.body.count1 < 1 ) return;


    var bookingID  = req.body.booking_id;  //booking to be edited
    var new_date   = new Date();
    var newCount   = req.body.count1;

       // get booking
       Booking.findById(bookingID,function(err,booking)
        {
          if(err || !booking)
             res.send("Oops, something went wrong, please try again with the correct information ");
          else
          {
             if(!booking) res.send("Oops, something went wrong, please try again with the correct information ");
            // get event occurrence of this booking
            EventOccurrences.findById(booking.event_id, function(err,eventocc)
            {
               if(err || !eventocc)
                     res.send("Oops, something went wrong, please try again with the correct information ");
                else
                {
                   if(!eventocc) res.send("Oops, something went wrong, please try again with the correct information ");
                  //get event of event occurrence
                  Events.findById(eventocc.event,function(err,event)
                  {
                    if(err || !event)
                       res.send("Oops, something went wrong, please try again with the correct information ");
                    else
                    {
                        var business = event.business_id;

                        //check if this booking belongs to business currently manipulating it
                        if(business != req.user.id)
                            res.send("You do not have authority to access this page");
                         else
                         {
                            var old = booking.count;
                             //cannot book more than available number
                             if(eventocc.available < newCount)
                                res.send("capacity doesn't allow more than "+ eventocc.available);
                              else
                              {
                                 Booking.findByIdAndUpdate(bookingID,{$set:{'booking_date':new_date,'count':newCount}},
                                 function(err,booking2)
                                  {
                                    if(err || !booking2)
                                      res.send("Oops, something went wrong, please try again with the correct information ");
                                     else
                                     {
                                       //update available
                                        eventocc.available = eventocc.available - newCount -(-old);
                                        eventocc.save();
                                        res.send("Edited booking successfully");
                                      }
                                  });
                                }
                            }
                      }
                    });
                 }
              });
          }
        });

  }
  else
  {
    res.send("Business not logged in");
  }


}

exports.cancel_booking = function(req,res)
{
  if(req.user && req.user instanceof Business)
  {
    var bookingID = req.body.booking_id;       //id of booking to be cancelled
    var event_id  = req.body.event_id;         //event_id of booking to be cancelled

     // get booking
        Booking.findById(bookingID,function(err,booking)
        {
          if(err || !booking)
             res.send("Oops, something went wrong, please try again with the correct information ");
          else
          {
            if(!booking) res.send("Oops, something went wrong, please try again with the correct information ");

            // get event occurrence of this booking
            EventOccurrences.findById(booking.event_id, function(err,eventocc)
            {
               if(err || !eventocc)
                     res.send("Oops, something went wrong, please try again with the correct information ");
                else
                {
                    if(!eventocc) res.send("Oops, something went wrong, please try again with the correct information ");
                    //get event of event occurrence
                    Events.findById(eventocc.event,function(err,event)
                    {
                      if(err || !event)
                          res.send("Oops, something went wrong, please try again with the correct information ");
                      else
                      {
                        var business = event.business_id;

                         //check if this booking belongs to business currently manipulating it
                         if(business != req.user.id)
                            res.send("You do not have authority to access this page");
                          else
                          {

                             Booking.findByIdAndRemove(bookingID,function(err,booking)
                              {
                                if(err || !booking)
                                    res.send("Oops, something went wrong, please try again with the correct information ");
                                else
                                {
                                   EventOccurrences.findByIdAndUpdate(event_id,{ $pull: {bookings: bookingID}},
                                    function(err,eventocc)
                                     {
                                      if(err || !eventocc)
                                          res.send("Oops, something went wrong, please try again with the correct information ");
                                       else
                                       {
                                          eventocc.available = eventocc.available + booking.count;
                                          eventocc.save();
                                          res.send("Booking cancelled");
                                       }
                                   });

                                  }
                              });


                          }
                      }
                    });
                 }
              });
          }
      });
  }
  else
  {
    res.send("Business not logged in");
  }

}

exports.view_event_bookings = function(req,res)
{
  if(req.user && req.user instanceof Business)
  {
    var event_id  = req.body.event_id;

    EventOccurrences.findById(event_id,function(err,eventocc)
    {
        if(err || !eventocc)
          res.send("Oops, something went wrong, please try again with the correct information ");
        else
        {
          Events.findById(eventocc.event,function(err,event)
          {

              if(err || !event)
                res.send("Oops, something went wrong, please try again with the correct information ");
              else
              {
                //check if this event belongs to business currently viewing its bookings
                if(event.business_id == req.user.id)
                {
                  EventOccurrences.findOne({_id:event_id}).populate('bookings').exec(function(err,bookings)
                  {
                      if(err || !bookings)
                         res.send("Oops, something went wrong, please try again with the correct information ");
                       else
                        res.send(bookings);
                  });
                }
                else
                {
                   res.send("You do not have authority to access this page");
                }
            }
          });
        }
    });

  }
  else
  {
    res.send("Business not logged in");
  }
}


//======================= < USER > ==============================

//Registered User adds bookings by giving count, event id. Booking date is saved as current date.
exports.regUserAddBooking = function(req, res, next) {

  if(req.user)
  {
		if(req.user instanceof RegisteredUser)
		{


      if(req.body.count <= 0)
        return res.send("Can't have negative or no count.");

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
                    booking.remove();
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
                     booking.remove();
										 res.send("Error saving booking. Please try again.");
										 return;
									 }
									 else
									 {
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
						return;
	        }
	    });
	  }
		else
		{
			res.send("You are not a registered user");
			return;
		}


	}
	else
	{
		res.send("Please log in to book events");
		return;
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
				if(err || !bookings)
				{
					res.send("Error finding bookings or possibly no bookings");
					return;
				}
				else
				{
					res.send(bookings.bookings);
					return;
				}
	    });
		}
		else
		{
			res.send("You are not a registered user.");
			return;
		}
  }
 else
  {
    res.send("Please log in to view upcoming bookings.");
		return;
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
				{
					res.send("Error deleting booking. Please recheck information and try again.");
					return;
				}
				else
				{
					if(booking.booker == req.user.id)
					{
						RegisteredUser.findByIdAndUpdate(req.user.id, {"$pull" : {bookings: req.body.bookingD}}, function(err,user)
						{
							if(err || !user ) return res.send("Error");
						});
						EventOccurrences.findByIdAndUpdate(booking.event_id, {"$pull" : {bookings: req.body.bookingD}}, function(err,eve)
						{
							if(err || !eve) return res.send("Error.");
							eve.available = eve.available + booking.count;
							eve.save();
							res.send(booking);
						});

					}
					else
					{
						res.send("Not one of your bookings.");
						return;
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
