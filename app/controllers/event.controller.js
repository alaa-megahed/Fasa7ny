
var Events = require('mongoose').model('Events');
var EventOccurrences = require('mongoose').model('EventOccurrences');
var Business = require('mongoose').model('Business');
var Bookings = require('mongoose').model('Booking');
var Facility = require('mongoose').model('Facility');
var User = require('mongoose').model('RegisteredUser');
var async = require("async");
var schedule = require('node-schedule');



exports.createFacility = function(req,res)
{
	if (req.user && req.user instanceof Business) 
	{
		var id = req.user.id;

		if(!req.body.name || !req.body.description || !req.body.price || !req.body.capacity) 
		{
			res.send("incomplete form");
		}
		else
		{
			var facility = new Facility(
			{
				name : req.body.name,
				description:req.body.description,
				capacity:req.body.capacity,
				business_id: id
			});

			facility.save(function(err)
			{
				if(err)
					res.send("Oops Something went wrong");
			});
		}


	}
}

//add edit and delete facility

exports.editFacility = function(req,res)
{
	if (req.user && req.user instanceof Business) 
	{
		var id = req.user.id;
		var facility_id = req.body.facility_id;

		Facility.findById(facility_id,function(err,facility)
		{
			if(err || !facility)
				return res.send("Oops!! Something went wrong");
			if(req.body.name)
				facility.name = req.body.name;

			if(req.body.description)
				facility.description = req.body.description;

			if(req.body.capacity)
				facility.capacity = req.body.capacity;

			facility.save();

		});

		 
		else
		{
			var facility = new Facility(
			{
				name : req.body.name,
				description:req.body.description,
				capacity:req.body.capacity,
				daysOff: req.body.day,
				business_id: id
			});

			facility.save(function(err)
			{
				if(err)
					res.send("Oops Something went wrong");
			});
		}


	}
}
	


/* This function creates an event. An event can have two types Once or Daily specified by "repeated". 
The function creates an event and save it in the database. If it is Daily then 30 instances of event occurrences 
will be created and saved in the database. Then I initialize a scheduling rule using node scheduler which adds a 
single event occurence next month on a daily basis. 
If the type is Once only one event occurrence is added.
*/
exports.createEvent = function (req, res) {

	if (req.user && req.user instanceof Business) {
		var id = req.user.id;

    	//if event belongs to facility, fields will be passed from facility to event in hidden fields
    	if(!req.body.name || !req.body.description || !req.body.price || !req.body.capacity || !req.body.repeat) {
     
        res.send("Please add all information");

        }
        else if(req.body.repeat != "Once" && req.body.repeat!="Daily"){
        res.send("Repitition type can either be Daily or Once");
    	}
        else {

        	if(req.body.capacity > 0 && req.body.price > 0){
			let event = new Events({
				name:req.body.name,
				description:req.body.description,
				price:req.body.price,
				capacity:req.body.capacity,
				repeated: req.body.repeat,
				// daysOff: req.body.day,
				business_id: id

				});

				//loaction not required (event can take place in many places or in business venue)
				if(req.body.location)
				{
					event.location = req.body.location;
				}

				//facility not required in case of just once events
				if(req.body.facility_id)
				{
					event.facility_id = req.body.facility_id;
					// set event daysoff to facility daysoff
					Facility.findById(req.body.facility_id, function(err, facility){
						if(err) throw err;
						else 
							event.daysOff = facility.daysOff;
					});
				}

				if (typeof req.file == "undefined") {
					event.image = " ";
				}
				else {
					event.image = req.file.filename;

				}


				event.save(function (err, event) {
					if (err) res.send(err.message);

				});

				if (req.body.repeat == "Daily") {

					var now = new Date();
					var arr = [];

					for (var i = 0; i < 30;) {
						now.setDate(now.getDate() + 1);
						var tflag = true;

						for (l = 0; l < event.daysOff.length; l++) {
							var y = Number(event.daysOff[l]);

							if (y == now.getDay()) {
								tflag = false;
							}
						}
						if (tflag) {
							arr[i] = new Date(now);
							i++;
						}
					}



					async.each(arr, function (date, callback) {


						let occurrence = new EventOccurrences({
							day: date,
							time: req.body.timing,
							available: req.body.capacity,
							event: event._id
						});

						if(req.body.facility_id)
						{
							occurrence.facility_id = req.body.facility_id;
						}

						occurrence.save(function (err, occurrence) {
							if (err) res.send(err.message);

						});
					}, function (error) {
						if (error) res.json(500, { error: error });
					});

					var rule = new schedule.RecurrenceRule();
					rule.dayOfWeek = [new schedule.Range(0, 6)];
					rule.hour = 0;
					rule.minute = 0;


					var j = schedule.scheduleJob(rule, function () {
						var d = new Date();
						var n = d.getMonth();


						d.setMonth((n + 1) % 12);
						var day = d.getDay();

						let occurrence = new EventOccurrences({
							day: d,
							time: req.body.timing,
							available: req.body.capacity,
							event: event._id
						});

						if(req.body.facility_id)
						{
							occurrence.facility_id = req.body.facility_id;
						}

						var flag = true;

						for (i = 0; i < event.daysOff.length; i++) {
							var x = Number(event.daysOff[i]);

							if (x == day) {
								flag = false;
							}
						}

						if (flag) {
							occurrence.save(function (err, occurrence) {
								if (err) res.send(err.message);

							});
						}

					});

				}

				else
					if (req.body.repeat == "Once") {


						let occurrence = new EventOccurrences({
							day: req.body.date,
							time: req.body.timing,
							available: req.body.capacity,
							event: event._id
						});

						occurrence.save(function (err, occurrence) {
							if (err) 
								res.send(err.message);
							else
								{
									var content = req.user.name + " added " + req.body.name +"        "+ Date.now(); 

									async.each(req.user.subscribers, function(subscriber, callback){
										User.findByIdAndUpdate({_id:subscriber},{$push:{"notifications": content}},function(err,user)
										{
											if(err)
												console.log("error updating user notifications");
											else
											{
												user.unread_notifications = user.unread_notifications + 1;
												user.save();
												console.log(user);
											}
										});
									});	
								}

						});


					}



				res.send('Event created!');
			}
			else res.send('Incorrect input');
		}
	}
	else {
		res.send('You are not a logged in business');
	}
}

exports.getOnceEvents = function(req,res)
{
	//whoever views business page can see all "once" events, no restrictions 
	var business_name = req.params.name;

	Business.find({name:business_name},function(err,business)
	{
		if(err || !business)
			res.send("Oops!! Something went wrong");
		else
		{
			Events.find({business_id: business.id,repeated:"Once"},function(err,events)
			{
				if(err)
					res.send("Oops!! Something went wrong");
				else
					res.send(events);
			});
		}
		
	});
}

exports.getFacilities = function(req,res)
{	
	//whoever views business page can see all facilities, no restrictions 
	var business_name = req.params.name;

	Business.find({name:business_name},function(err,business)
	{
		if(err || !business)
			res.send("Oops!! Something went wrong");
		else
		{
			Facility.find({business_id: business.id},function(err,facilities)
			{
				if(err)
					res.send("Oops!! Something went wrong");
				else
					res.send(facilities);
			});
		}
		
	});
	
}

exports.getEvents = function (req, res) {
	if (req.user && req.user instanceof Business) {
		Events.find({ business_id: req.user.id }, function (err, events) {
			if (err) res.send(err.message);
			else if (!events) res.send('Something went wrong');
			else res.send(events);
		});
	}
	else {
		res.send('You are not a logged in business');
	}

}

exports.getOccurrences = function (req, res) {
	if (req.user && req.user instanceof Business && typeof req.body.id != "undefined") {
		EventOccurrences.find({ event: req.body.id }, function (err, events) {
			if (err) res.send(err.message);
			if (!events) res.send('Something went wrong');
			else res.send(events);
		});

	}
	else {
		res.send('You are not a logged in business');
	}
}

/* A business can edit an event or an event occurrence based on the changed field. */

exports.editEvent = function (req, res) {
	if (req.user && req.user instanceof Business && typeof req.body.id != "undefined") {

		var id = req.body.id;
		var business_id = req.user.id;


		Events.findById(id, function (err, event) {
			if (err) res.send(err.message);
			else if (!event) res.send('Something went wrong');
			else {
				if (event.business_id == business_id) {

					if (typeof req.body.name != "undefined" && req.body.name.length > 0) {
						event.name = req.body.name;
					}

					if (typeof req.body.location != "undefined" && req.body.location.length > 0) {
						event.location = req.body.location;
					}
					if (typeof req.body.price != "undefined" && req.body.price.length > 0) {
						event.price = req.body.price;
					}

					if (typeof req.body.capacity != "undefined" && req.body.capacity.length > 0) {
						var oldCapacity = event.capacity;
						if (oldCapacity < req.body.capacity) {

							var difference = req.body.capacity - oldCapacity;
							EventOccurrences.find({ event: event._id }, function (err, eventOcc) {
								if (!eventOcc) res.send('Something went wrong');

								for (var i = 0; i < eventOcc.length; i++) {
									eventOcc[i].available += difference;
									eventOcc[i].save();
								}

							});
							event.capacity = req.body.capacity;

						}
						else if (oldCapacity > req.body.capacity) {


							var difference = oldCapacity - req.body.capacity;
							EventOccurrences.find({ event: event._id }, function (err, eventOcc) {
								if (!eventOcc) res.send('Something went wrong');

								var check = 0;
								for (var i = 0; i < eventOcc.length && check == 0; i++) {
									if (eventOcc[i].available < difference) {
										check = 1;
										res.send("Can not decrease capacity without cancelling extra bookings. Please cancel extra bookings.");
									}

								}

								if (check == 0) {
									EventOccurrences.find({ event: event._id }, function (err, eventOcc) {
										if (!eventOcc) res.send('Something went wrong');
										for (var i = 0; i < eventOcc.length; i++) {
											eventOcc[i].available -= difference;
											eventOcc[i].save();
										}

									});
									event.capacity = req.body.capacity;

								}

							});
						}
						else event.capacity = req.body.capacity;

					}

					if (typeof req.body.description != "undefined" && req.body.description.length > 0) {
						event.description = req.body.description;
					}
					if (typeof req.body.day != "undefined" && req.body.day.length > 0) {
						event.daysOff = req.body.day;
					}
					if (typeof req.body.date != "undefined" && req.body.date.length > 0) {
						if (event.repeated == "Once") {
							EventOccurrences.findOneAndUpdate({ event: id }, { $set: { day: req.body.date } }, function (err, occurrence) {
								if (err) res.send('Could not update');
								else if (!occurrence) res.send('Something went wrong');

							});
						}
					}
					if (typeof req.body.timing != "undefined" && req.body.timing.length > 0) {
						EventOccurrences.update({ event: id }, { $set: { time: req.body.timing } }, { "multi": true }, function (err) {
							if (err) res.send(err.message);
						});

					}
					event.save();
					res.send(event);

				}
				else res.send('Can not edit this event!');
			}

		});
	}
	else {
		res.send('You are not a logged in business');
	}

}


/*A business can cancel an event with all its occurrences.*/

exports.cancelEvent = function (req, res,notify_on_cancel) {
	if (req.user && req.user instanceof Business && typeof req.body.id != "undefined") {
		var id = req.body.id;
		var business_id = req.user.id;
		Events.findById(id, function (err, event) {
			if (!event) res.send('Something went wrong');
			else
				if (event.business_id == business_id) {

					Events.remove({ _id: id }, function (err) {
						if (err) res.sen('could not delete event');
						else {
							EventOccurrences.find({event:id},function (err,all_occ) {
								if (err) res.send('could not delete occurrence');
								else 
									{
										async.each(all_occ, function(one_occ, callback) 
										{
											one_occ.remove(function(err)
										    {
										      if(!err)
										      {
											      	var bookings = one_occ.bookings;
													var content = req.user.name + " cancelled " + event.name + "     " + Date.now(); 
													
													async.each(bookings, function(one_booking, cb){
														Bookings.findById({_id:one_booking},function(err,booking)
														{
															User.findByIdAndUpdate({_id:booking.booker},{$push:{"notifications": content}},function(err,user)
															{
																if(err)
																	console.log("error updating user notifications");
																else
																	console.log(user);
															});
														});
													});
											      	// notify_on_cancel_occ(event.name,one_occ.id,req.user.name);
										      	res.send("event canceled");
										      }
										  	  else
										  	  	res.send("Something went wrong");
										    });
										});
									 }
							});
						}
					});
				}
				else {
					res.send('Cannot cancel this event!');
				}
		});
	}
	else {
		res.send('You are not a logged in business');
	}

}


/** Removes all occurence of an event */
exports.removeAllOccurrences = function (event_id) {
	EventOccurrences.remove({ event: event_id }, function (err) {
		if (err)
			console.log(err);
	})
}

/* Abusiness can cancel an event occurrence.*/

exports.cancelOccurrence = function (req, res,notify_on_cancel_occ) {
	if (req.user && req.user instanceof Business && typeof req.body.id != "undefined") {
		var occurrence_id = req.body.id;
		var business_id = req.user.id;
		EventOccurrences.findById(occurrence_id, function (err, occ) {
			if (!occ) res.send('Something went wrong');

			Events.findById(occ.event, function (err, event) {
				if (!event) res.send('Something went wrong');
				else
					if (event.business_id == business_id) {

						EventOccurrences.remove({ _id: occurrence_id }, function (err) {
							if (err) res.send('could not delete occurrence');
							else 
						    {
						    	var bookings = occ.bookings;
								var content = req.user.name + " cancelled " + event.name + "     " + Date.now(); 
													
								async.each(bookings, function(one_booking, cb){
									Bookings.findById({_id:one_booking},function(err,booking)
									{
										User.findByIdAndUpdate({_id:booking.booker},{$push:{"notifications": content}},function(err,user)
										{
											if(err)
												console.log("error updating user notifications");
											else
												console.log(user);
										});
									});
								});
								// notify_on_cancel_occ(event.name,occurrence_id,req.user.name);
								//res.send('occurrence deleted');
							}
						});

						res.send('Occurrence cancelled');
					}
					else {
						res.send('Can not cancel this occurrence');
					}
			});
		});
	}
	else {
		res.send('You are not a logged in business');
	}

}

//================================ Notifications =====================================

function notify_on_create(event_name,subscribers,business)
{
	//Notification:  "Business name" just added "event name".
	var content = business + " added " + event_name +"        "+ Date.now(); 

	async.each(subscribers, function(subscriber, callback){
		User.findByIdAndUpdate({_id:subscriber},{$push:{"notifications": content}},function(err,user)
		{
			if(err)
				console.log("error updating user notifications");
			else
				console.log(user);
		});
	});	
}



function notify_on_cancel_occ(event_name,eventocc_id,business)			    //would be exactly the same for edit event but 												
{													//different  notification content, how to check
													// which function am I currently executing	
	EventOccurrences.findOne({_id:eventocc_id},function(err,eventocc)
	{
		if(err)
			console.log("err in notify_on_cancel");
		else
		{
			var bookings = eventocc.bookings;
			var content = business + " cancelled " + event_name; 
			var notification = new Notification(
			{
				date: new Date(),
				content: content
			});

			notification.save(function(err,notification)
			{
				if(err)
					console.log("error saving notification");
				else
				{

					for(var i = 0; i < bookings.length; i++)
					{
						Bookings.findById({_id:bookings[i]},function(err,booking)
						{
							User.findByIdAndUpdate({_id:booking.booker},{$push:{"notifications": notification}},function(err,user)
							{
								if(err)
									console.log("error updating user notifications");
								else
									console.log(user);
							});
						});
						
					}
				}
			});

		}
	});
}
