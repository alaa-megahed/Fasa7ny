var Booking  = require('mongoose').model('Booking');
var Events   = require('mongoose').model('Events');
var EventOccurrences   = require('mongoose').model('EventOccurrences');
var RegisteredUser     = require('mongoose').model('RegisteredUser');


<<<<<<< HEAD
=======



>>>>>>> subscription
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
<<<<<<< HEAD
		  booking_date : new Date(),
	    count        : form.count,
	    event_id	   : event_id
//	  booker       : req.user.id	//get business user id from session?
=======
		booking_date : new Date(),
	    count        : form.count,
	    event_id	 : event_id
//	    booker       : req.user.id	//get business user id from session?
>>>>>>> subscription
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

<<<<<<< HEAD
			EventOccurrences.findByIdAndUpdate(event_id,{$push: {"bookings": booking}},{safe: true, upsert: true, new : true},
=======
			EventOccurrences.findByIdAndUpdate(event_id,{$push: {"bookings": booking},},{safe: true, upsert: true, new : true},
>>>>>>> subscription
		        function(err, eventocc)
		        {
		        	if(err)
		            console.log(err);
		        	else
		        	{
		        		console.log(eventocc);
		        		eventocc.available = eventocc.available - booking.count;
<<<<<<< HEAD
		          	eventocc.save();
=======
		          		eventocc.save();
>>>>>>> subscription

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
<<<<<<< HEAD
	var bookingID    = "58e14564de21c3446730b843"; 	//for testing
=======
	var bookingID    = "58de649c8d5ac33769863bc3"; 	//for testing
>>>>>>> subscription
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


exports.regUserAddBooking = function(req, res, next) {

  // if(req.user)
  // {
    var date = new Date();
    console.log(req.body.count+10);
    var booking = new Booking(
      {
        count        : req.body.count,
        booker       : req.body.id, //change to req.user.id after serialization
        event_id     : req.body.event,
        booking_date : date
      });

    booking.save(function(err,booking) {
        if (!err) {

          //finds registered user and adds this event to his/her list of bookings
            RegisteredUser.findOne({_id:req.body.id}, function(err, user){
              if(err)
                throw err;

              else {
                user.bookings.push(booking);
                user.save();
                }

            });

            //decreases capacity of event occurence and stores booking in event occurence's list of bookings

             EventOccurrences.findOneAndUpdate({_id:req.body.event}, {"$push" : {"bookings": booking}}, function(err,eve){
              eve.available = eve.available - req.body.count;
              eve.save();
               console.log(eve);

             });

            res.send("successful booking");

        }
        else {

        }
    });
  // }
  // else {
  //   res.send("Please log in to book events");
  // }

};


exports.regUserViewBookings = function(req,res,next){

  // if(req.user)
  // {
    //change to req.user.id l8r
    RegisteredUser.findOne({_id:req.body.id}).populate('bookings').exec(function(err, bookings){
        console.log(bookings);

        res.send(bookings);
    });
//  }
//  else
  //{
    //res.send("Please log in to view upcoming bookings.");
  //}

};

exports.regUserEditBookings = function(req,res,next){

  // if(req.user)
  // {
    Booking.findById(req.body.booking, function(err,booking){
        EventOccurrences.findOne(booking.event_id, function(err, eve){
          eve.available = eve.available + booking.count - req.body.count;
          eve.save();
          booking.count = req.body.count;
          booking.save();
        })


    } );

    res.send("successful edit");
  // }
  // else
  // {
  //   res.send("Please log in to edit bookings");
  // }

}

exports.regUserDeleteBookings = function(req,res,next){

  // if(req.user)
  // {

    Booking.findByIdAndRemove(req.body.booking, function(err,booking){
      if(err) throw err;
      RegisteredUser.findByIdAndUpdate(req.body.id, {"$pull" : {bookings: req.body.booking}}, function(err,user){
        if(err) throw err;
      })
      EventOccurrences.findByIdAndUpdate(booking.event_id, {"$pull" : {bookings: req.body.booking}}, function(err,eve){
        if(err) throw err;
        eve.available = eve.available + booking.count;
        eve.save();
        res.send(booking);
      })

    });


  // }
  // else
  // {
  //   res.send("Please log in to delete bookings");
  // }

}
