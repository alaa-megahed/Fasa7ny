var Booking  = require('mongoose').model('Booking');
var PermanentEvent = require('mongoose').model('PermanentEvent');
var SpecialEvent   = require('mongoose').model('SpecialEvent');

exports.book_event = function (req,res) 
{
	var form     = req.body; 
//  var event_id = req.params.event_id; // pass event id in url 
	var	event_id = "58dd5efa27b262ff6a68bd4d"; //for testing this is already from the database

//	var date  = new Date().toJSON().slice(0,10).replace(/-/g,'/');
	var booking = new Booking
	({
		booking_date : new Date(),
	    count        : form.count, 
	    event_id	 : event_id
//	    booker       : session.user._id	//get business user id from session?
	});	

//	need to check capacity and available before saving 
	booking.save(function(err,booking)
	{
		if(err)
		{	
			console.log("error in business saving booking "+booking);
		}
		else
		{	
			console.log("saved "+ booking);
	
			SpecialEvent.findByIdAndUpdate(event_id,{$push: {"bookings": booking} },{safe: true, upsert: true, new : true},
		        function(err, model) 
		        {
		            console.log(err);
		        }
		    );
		    PermanentEvent.findByIdAndUpdate(event_id,{$push: {"bookings": booking} },{safe: true, upsert: true, new : true},
		        function(err, model) 
		        {
		            console.log(err);
		        }
		    );
		}

	});	

	res.send("khalaweess");
}

exports.edit_booking = function(req,res)
{
//	var bookingID    = req.params.id;        		//id of booking to be edited should be passed in the url or body
	var bookingID    = "58dd611a24c88830b201ce79"; 	//for testing
	var new_date 	 = new Date(); 		
	var count 		 = req.body.count1;

	Booking.findByIdAndUpdate(bookingID,{$set:{'count':count,'booking_date':new_date}},
	function(err,booking)
	{
		if(err)
			console.log("error editing booking");
		else
		{
			console.log("successfully edited "+count);
			res.send("check database");
		}	
	});

}

exports.cancel_booking = function(req,res)
{
//	var bookingID = req.params.id;        //id of booking to be edited should be passed in the url or body
	var bookingID    = "58dd611a24c88830b201ce79"; 	//for testing

	Booking.remove({_id: bookingID},function(err)
	{
		if(err)
			console.log("error cancel booking");
		else
		{
			console.log("successfully cancelled");
			res.send('el mafrood deleted');
		}	
	});
}