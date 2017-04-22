var Booking  = require('mongoose').model('Booking');
var Events   = require('mongoose').model('Events');
var EventOccurrences   = require('mongoose').model('EventOccurrences');
var RegisteredUser     = require('mongoose').model('RegisteredUser');
var Business           = require('mongoose').model('Business');
var configAuth = require("../../config/auth"),
    stripe = require("stripe")(configAuth.stripe.secretKey);


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
                          booker       : req.user.id,
                          business_id  : req.user.id
                      });

                      //update number of available bookings in event occurrence by subtracting
                      // the number of people in booking (count) and the available.
                      booking.save(function(err,booking)
                      {
                        if(err || !booking)
                            res.send("Oops, something went wrong, please try again with the correct information ");
                         else
                         {
                          var newAvailable = eventocc.available - booking.count;

                          // Insert booking in array of bookings of booked event occurrence
                          EventOccurrences.findByIdAndUpdate(event_id,{$set:{"available":newAvailable},$push: {"bookings": booking}},{safe: true, upsert: true, new : true},
                          function(err,eventoccur)
                          {
                            if(err || !eventoccur)
                              res.send("Oops, something went wrong, please try again with the correct information ");
                            else
                              res.json(booking);
                          });
                      }
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
            // get event occurrence of this booking
            EventOccurrences.findById(booking.event_id, function(err,eventocc)
            {
               if(err || !eventocc)
                     res.send("Oops, something went wrong, please try again with the correct information ");
                else
                {
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
                             if(eventocc.available - newCount -(-old) < 0)
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

  // if(req.user && req.user instanceof Business)
  // {

    var bookingID = req.body.booking_id;       //id of booking to be cancelled
    var event_id  = req.body.event_id;         //event_id of booking to be cancelled

    console.log("in node .... bookingID  "+bookingID +"  event_id   "+event_id);

     // get booking
        Booking.findById(bookingID,function(err,booking)
        {
          if(err || !booking)
             return res.status(500).json("Oops, Something went wrong, please try again with the correct information");
          else
          {
            // get event occurrence of this booking
            EventOccurrences.findById(booking.event_id, function(err,eventocc)
            {
               if(err || !eventocc)
                     return res.status(500).json("Oops, Something went wrong, please try again with the correct information");
                else
                {
                    //get event of event occurrence
                    Events.findById(eventocc.event,function(err,event)
                    {
                      if(err || !event)
                          return res.status(500).json("Oops, Something went wrong, please try again with the correct information");
                      else
                      {
                        var business = event.business_id;

                         //check if this booking belongs to business currently manipulating it
                         // if(business != req.user.id)
                         //    res.status(403).json("You do not have authority to access this page");
                         //  else
                           //{

                             Booking.findByIdAndRemove(bookingID,function(err,booking)
                              {
                                if(err || !booking)
                                    return res.status(200).json("Oops, something went wrong, please try again with the correct information ");
                                else
                                 {
                                    var content = business.name + " cancelled your booking in " + event.name + "     " ;
                                    var now =  Date.now();
                                    RegisteredUser.findByIdAndUpdate({_id:booking.booker},{$push:{"notifications": {content: content, date: now}}},function(err,user)
                                    {
                                      if(err)
                                       return res.status(500).json("Oops, Something went wrong, please try again with the correct information");
                                    });

                                    var charge_id = booking.stripe_charge;
                                    if(!charge_id || charge_id === undefined)
                                    {
                                      return res.status(200).json(booking);
                                    }
                                    else
                                    {
                                      var amount = Math.round(booking.charge * 97);
                                      var refund = stripe.refunds.create({
                                          charge: charge_id,
                                          amount: amount
                                        }, function(err, refund) {
                                          if(err)
                                          {
                                            res.status(500).json(err.message);
                                          }
                                          else
                                          {
                                            res.status(200).json("refund successfully completed");
                                          }
                                        });
                                    }



                                     EventOccurrences.findByIdAndUpdate(event_id,{ $pull: {bookings: bookingID}},
                                      function(err,eventocc)
                                       {
                                        if(err || !eventocc)
                                            return res.status(500).json("Oops, Something went wrong, please try again with the correct information");
                                         else
                                         {
                                            eventocc.available = eventocc.available + booking.count;
                                            eventocc.save();
                                            res.status(200).json("Booking cancelled successfully, booker is notified");
                                         }
                                     });

                                  }
                              });


                          //}
                      }
                    });
                 }
              });
          }
      });
  // }
  // else
  // {
  //   res.status(401).json("You do not have authority to access this page");
  // }

}


exports.cancel_booking_after_delete = function(req, res)
{
   var bookingID = req.body.booking_id;       //id of booking to be cancelled
   // var business_id = req.user._id;
   // TODO add business name in notification after query
                              Booking.findByIdAndRemove(bookingID,function(err,booking)
                              {
                                if(err || !booking)
                                    return res.status(200).json("Oops, something went wrong, please try again with the correct information ");
                                else
                                 {
                                    // var content = business.name + " cancelled your booking in " + event.name + "     " + Date.now();
                                    var content = "Nourhan" + " cancelled your booking in "  + "     " ;
                                    var now = Date.now();
                                    RegisteredUser.findByIdAndUpdate({_id:booking.booker},{$push:{"notifications": {content: content, date: now}}},function(err,user)
                                    {
                                      if(err)
                                       return res.status(500).json("Oops, Something went wrong, please try again with the correct information");
                                    });

                                    var charge_id = booking.stripe_charge;
                                    if(!charge_id || charge_id === undefined)
                                    {
                                      return res.status(200).json(booking);
                                    }
                                    else
                                    {
                                      var amount = Math.round(booking.charge * 97);
                                      var refund = stripe.refunds.create({
                                          charge: charge_id,
                                          amount: amount
                                        }, function(err, refund) {
                                          if(err)
                                          {
                                            res.status(500).json(err.message);
                                          }
                                          else
                                          {
                                            res.status(200).json("refund successfully completed");
                                          }
                                        });
                                    }
                                  }
                              });

};

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
};


//======================= < USER > ==============================


//Registered User adds bookings by giving count, event id. Booking date is saved as current date.
exports.regUserAddBooking = function(req, res, next) {

  if(req.user)
  {
		if(req.user instanceof RegisteredUser)
		{


      if(req.body.count <= 0)
        return res.status(400).json("Can't have negative or zero count.");
    
			var date = new Date();
	    var booking = new Booking(
	      {
	        count        : req.body.count,
          booker       : req.user.id,
	        event_id     : req.body.event,
          business_id  : req.body.business_id,
	        booking_date : date,
          charge       : req.body.charge,
          stripe_charge: req.body.stripe_charge
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
									res.status(500).json("Error adding booking. Please try again!");
									return;
								}
								else
								{
									eve.available = eve.available - req.body.count;
									if(eve.available < 0)
									{
                    booking.remove();
										res.status(500).json("Not enough spaces - please decrease count of booking.");
										return;
									}
									else
									{
											eve.bookings.push(booking);
											eve.save();
									}

									//finds registered user and adds this event to his/her list of bookings
                  // RegisteredUser.findOne({_id:req.user.id}, function(err, user)

									RegisteredUser.findOne({_id:req.user.id}, function(err, user)
								 {
									 if(err || !user)
									 {
                     booking.remove();
										 res.status(500).json("Error saving booking. Please try again.");
										 return;
									 }
									 else
									 {
										 user.bookings.push(booking);
										 user.save();
										 res.status(200).json("successful booking");
										 return;
									 }

								 });
								}
						 });
	        }
	        else
					{
						return res.status(500).json("Error. Please try again. hena1");
	        }
	    });

	  }

	}

	else
	{
		res.status(401).json("Please log in to book events");
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
              if(err || !eve)
                return res.send("Error!");
							eve.available = eve.available + booking.count - req.body.count;
							if(eve.available < 0 || req.body.count == 0)
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

  console.log("in node bookingD is   "+req.body.bookingD);
  // if(req.user)
  // {
		// if(req.user instanceof RegisteredUser)
		// {
			Booking.findById(req.body.bookingD, function(err,booking)
			{
				if(err || !booking)
				{
					res.send("Error deleting booking. Please recheck information and try again.");
					return;
				}
				else
				{
					// if(booking.booker == req.user.id)
					// {
						// RegisteredUser.findByIdAndUpdate(req.user.id, {"$pull" : {bookings: req.body.bookingD}}, function(err,user)
						// {
						// 	if(err || !user ) return res.send("Error");
						// });
						// EventOccurrences.findByIdAndUpdate(booking.event_id, {"$pull" : {bookings: req.body.bookingD}}, function(err,eve)
						// {
						// 	if(err || !eve) return res.status(500).json("Error.");
							// eve.available = eve.available + booking.count;
							// eve.save();
              booking.remove(function(err) {
                if(err)return res.status(500).json(err.message);
                else
                {
                  var charge_id = booking.stripe_charge;
                  if(!charge_id || charge_id === undefined)
                  {
                    return res.status(200).json(booking);
                  }
                  else
                  {
                    var amount = Math.round(booking.charge * 97);
                    var refund = stripe.refunds.create({
                        charge: charge_id,
                        amount: amount
                      }, function(err, refund) {
                        if(err)
                        {
                          res.status(400).json(err.message);
                        }
                        else
                        {
                          res.status(200).json("refund successfully completed");
                        }
                      });
                  }
                }           

              });
						// });

					}
					// else
					// {
					// 	res.send("Not one of your bookings.");
					// 	return;
					// }
		// 		}

		 	});
		// }
		// else
		// {
		// 	res.send("Not a registered user.");
		// }

  // }
  // else
  // {
  //   res.send("Please log in to delete bookings");
  // }

}

