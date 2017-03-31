var Booking  = require('mongoose').model('Booking');
var Events   = require('mongoose').model('Events');
var EventOccurrences   = require('mongoose').model('EventOccurrences');

exports.book_event = function (req,res) 
{
	var form     = req.body; 
//  var event_id = req.params.event_id; 	   // pass event id in url 
	var	event_id = "58de4bc1c6e6f2e13cc833e8"; // testing


	var booking = new Booking
	({
		booking_date : new Date(),
	    count        : form.count, 
	    event_id	 : event_id
//	    booker       : session.user._id	//get business user id from session?
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
			
			EventOccurrences.findByIdAndUpdate(event_id,{$push: {"bookings": booking},},{safe: true, upsert: true, new : true},
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
}

exports.edit_booking = function(req,res)
{
//	var bookingID    = req.params.id;        		//id of booking to be edited should be passed in the url or body
	var bookingID    = "58de649c8d5ac33769863bc3"; 	//for testing
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

}

exports.cancel_booking = function(req,res)
{
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


}

exports.view_event_bookings = function(req,res)
{

//  var event_id  = req.params.id 		  		 //event_id  should be passed in the url or body 
	var event_id  = "58de4bc1c6e6f2e13cc833e8";  //for testing

	EventOccurrences.findOne({_id:event_id}).populate('bookings').exec(function(err,bookings)
	{
		console.log(bookings);
		res.send(bookings);
	});
}