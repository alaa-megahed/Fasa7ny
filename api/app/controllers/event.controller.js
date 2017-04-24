
var Events = require('mongoose').model('Events');
var EventOccurrences = require('mongoose').model('EventOccurrences');
var Business = require('mongoose').model('Business');
var Bookings = require('mongoose').model('Booking');
var Facility = require('mongoose').model('Facility');
var User = require('mongoose').model('RegisteredUser');
var async = require("async");
var schedule = require('node-schedule');


exports.getEvent = function(req, res)
{
	if(req.params.id != "undefined")
	{
		Events.findById(req.params.id, function(err,event){
			if(err) return res.status(500).json("BAD REQUEST! NO SUCH EVENT EXISTS");
			else
				return res.status(200).json(event);
		});
	}
	else
	{
		return res.status(500).json("BAD REQUEST");
	}
}


exports.createFacility = function(req,res)
{

	if (req.user && req.user instanceof Business)
	{
		var id = req.user.id;
		console.log(req.body);
		console.log(req.file.filename);
		if(!req.body.name || !req.body.description || !req.body.capacity)
		{
			console.log("!");
			res.status(400).json("Incomplete form");
		}
		else
		{
			console.log("!!!");
			var facility = new Facility(
			{
				name : req.body.name,
				description:req.body.description,
				capacity:req.body.capacity,
				business_id: id
			});
			console.log("!!!!!!!");
			console.log(facility.image);
			console.log(facility);
			if(typeof req.file != "undefined") {
				console.log("msh undefined");
				facility.image = req.file.filename;
			} else {
				console.log("tle3 undefined");
				facility.image = 'default';
			}
			facility.save(function(err)
			{
				if(err)
					res.status(500).json("Oops Something went wrong");
				else{
					console.log(facility);
					res.status(200).json(id);
				}
			});
		}
	}
	else
		res.status(401).json("Not logged in Business");
}

//don't need to edit fields in repeated events because we will always get them from facility
exports.editFacility = function(req,res)
{
	if (req.user && req.user instanceof Business)
	{
		var id = req.user.id;

		var facility_id = req.params.facilityId;
		console.log(req.body);
		console.log();
		Business.findById(id,function(err,business)
		{
			if(err || !business)
				return res.status(500).json("Oops!! Something went wrong");

			Facility.findById(facility_id,function(err,facility)
			{
				if(err || !facility)
					return res.status(500).json("Oops!! Something went wrong");

				else
				{
					//checking that edited facility belongs to logged in business
					if(facility.business_id == id)
					{   if(req.body.name)
							facility.name = req.body.name;

						if(req.body.description)
							facility.description = req.body.description;

						if(req.file)
							facility.image = req.file.filename;

						//update capacity in event and available in event occurrences
						if(req.body.capacity)
						{
							facility.capacity = req.body.capacity;
							Events.update({facility_id:facility_id},{ $set: { capacity: Number(req.body.capacity) }},function(err,event)
							{
								console.log(req.body.capacity);
								if(err)
									return res.json({err:"error updating event"});
							});

							EventOccurrences.update({facility_id:facility_id},{ $set: { available: Number(req.body.capacity) }},function(err,eventocc)
							{
								if(err)
									return res.status(500).json({err:"error updating eventocc"});

								//To check if old occurrences have bookings>new capacity. I think it should
								// be applicable on the new occurrences and those that have not been exceeded.
								// or tell the business in the popup changes in capacity won't change past ones.
								// Bookings.find({event_id: eventocc.id},function(err,bookings)
								// {
								// 	if(err)
								// 		res.send("error");
								// 	else
								// 	{
								// 		if(bookings.length > req.body.capacity)
								// 			return res.status(500).json("You already have bookings more than new capacity");
								// 	}
								// });

							});

						}
						if(req.body.name)
						{
							Events.update({facility_id:facility_id},{ $set: { name: req.body.name }},function(err)
							{
								if(err)
									return res.json({err:"error updating event"});
							});
						}
						if(req.body.description)
						{
							Events.update({facility_id:facility_id},{ $set: { description: req.body.description }},function(err)
							{
								if(err)
									return res.json({err:"error updating event"});
							});
						}

						facility.save(function(err,newFacility){
							res.status(200).json(newFacility);
						});

					}
					else
						return res.status(500).json({err:"You are not authorized to perform this action"});
				}

			});
		});
	}
	else
		res.status(500).json("Not logged in Business");
}


exports.deleteFacility = function(req,res)
{
	if (req.user && req.user instanceof Business)
	{
		var id = req.user.id;
		var facility_id = req.params.facilityId;
		console.log("delete facility backend");
		Business.findById(id,function(err,business)
		{
			if(err || !business)
				return res.status(500).json({err:"Oops!! Something went wrong"});
			Facility.findById(facility_id,function(err,facility)
			{
				if(err || !facility)
					return res.status(500).json({err:"Oops!! Something went wrong"});

				else
				{
					if(facility.business_id == id)
					{
						Facility.remove({_id:facility_id}, function(err) {
							if(err) return res.status(500).json({err:"error removing facility"});
							console.log("et");
						});

						Events.remove({facility_id:facility_id},function(err)
						{
							if(err)
								return res.status(500).json({err:"error removing event"});

						});

						EventOccurrences.remove({facility_id:facility_id},function(err)
						{
							if(err)
								return res.status(500).json({err:"error removing event occurence"});
								// else res.status(200).json("Done Deleting");
						});
					}
					else
						return res.status(500).json({err:"You are not authorized to perform this action"});
				}
			});
			Facility.findByIdAndRemove(facility_id,function(err)
			{
				if(err)
					res.status(500).json("Something went wrong.");
				else
					res.status(200).json("cancelled facility successfully");
			});
		});
	}
	else
		res.status(500).json("Not logged in business");
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
		var now = new Date();
		console.log(req.body);
    	//if event belongs to facility, fields will be passed from facility to event in hidden fields
    	if(!req.body.name || !req.body.description || !req.body.date || !req.body.price || !req.body.capacity || !req.body.repeat) {

        res.status(500).json("Please add all information");

        }
        else if(req.body.repeat != "Once" && req.body.repeat!="Daily"){
        res.status(500).json("Repitition type can either be Daily or Once");
    		}
		else if(now - (new Date(req.body.date)) >= 0) {
				console.log("enter a valid start date");
				res.status(500).json("Enter a valid start date");
		}
        else {

        	if(req.body.capacity > 0 && req.body.price > 0){
						let event = new Events({
							name:req.body.name,
							description:req.body.description,
							price:req.body.price,
							capacity:req.body.capacity,
							repeated: req.body.repeat,
							daysOff: req.body.day,
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
				}

				if (typeof req.file != "undefined") {
					event.image = req.file.filename;
				}


				event.save(function (err, event) {
					if (err) res.send(err.message);

				});

				if (req.body.repeat == "Daily") {

					var now = new Date();
					if(req.body.date) {
						now = new Date(req.body.date);
					}
					var arr = [];

					for (var i = 0; i < 30;) {
						var tflag = true;

						for (l = 0; req.body.day && l < req.body.day.length; l++) {
							var y = Number(req.body.day[l]);

							if (y == now.getDay()) {
								// console.log(y);
								tflag = false;
							}
						}
						if (tflag) {
							arr[i] = new Date(now);
							console.log(arr[i] + "------" + arr[i].getDay());
							i++;
						}
						now.setDate(now.getDate() + 1);
					}



					async.each(arr, function (date, callback) {


						let occurrence = new EventOccurrences({
							day: date,
							time: req.body.timing,
							available: req.body.capacity,
							event: event._id,
							business_id: id
						});

						if(req.body.facility_id)
						{
							occurrence.facility_id = req.body.facility_id;
						}

						occurrence.save(function (err, occurrence) {
							if (err) res.status(500).json(err.message);

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
							event: event._id,
							business_id: id
						});

						if(req.body.facility_id)
						{
							occurrence.facility_id = req.body.facility_id;
						}

						var flag = true;

						for (i = 0; req.body.day && i < req.body.day.length; i++) {
							var x = Number(req.body.day[i]);

							if (x == day) {
								flag = false;
							}
						}

						if (flag) {
							occurrence.save(function (err, occurrence) {
								if (err) res.status(500).json(err.message);

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
							event: event._id,
							business_id: id
						});

						occurrence.save(function (err, occurrence) {
							if (err)
								res.status(500).json(err.message);
							else
							{
							var notification = {content:req.user.name + " added " + req.body.name,date: Date.now()};

									async.each(req.user.subscribers, function(subscriber, callback){
										User.findByIdAndUpdate({_id:subscriber},{$push:{"notifications": notification}},function(err,user)
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
				Business.find({_id:id},function(err,business){
					if(err) res.send(err.message);
					else res.status(200).json(business);
				});
			}
			else res.status(500).json('Incorrect input');
		}
	}
	else {
		res.status(500).json('You are not a logged in business');
	}
}

exports.getOnceEvents = function(req,res)
{
	//whoever views business page can see all "once" events, no restrictions
	var business_id = req.params.id;
	console.log(business_id);

	Business.findById(business_id,function(err,business)
	{
		if(err || !business)
			res.status(500).json("Oops!! Something went wrong");

		else
		{
			Events.find({business_id: business.id,repeated:"Once"},function(err,events)
			{
				if(err)
					res.status(500).json("Oops!! Something went wrong");
				else
					res.status(200).json(events);
			});
		}

	});
}

exports.getOnceEventDetails = function(req, res)
{
	var event_id = req.params.eventId;
	Events.findOne({_id:event_id}, function(err, event) {
		if(err || !event) res.status(500).json("error in findng the event");
		else {
			console.log("hi2");
			EventOccurrences.findOne({event:event_id}, function(err, eventocc) {
				if(err) console.log("error in finding the eventocc");
				if(!eventocc) res.status(500).json("error in findng the event");
				else{
					res.status(200).json({business: event.business_id, event:event, eventocc:eventocc});
				}
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
			res.status(500).json("Oops!! Something went wrong");
		else
		{
			Facility.find({business_id: business.id},function(err,facilities)
			{
				if(err)
					res.status(500).json("Oops!! Something went wrong");
				else
					res.status(200).json(facilities);
			});
		}

	});

}

exports.getEvents = function (req, res) {
	if (req.user && req.user instanceof Business) {
		var id = req.user.id;
		Events.find({ business_id: id }, function (err, events) {
			if (err) res.status(500).json(err.message);
			else if (!events) res.status(500).json("Something went wrong");
			else {

		var name = req.params.name;

		Business.findOne({name:name}, function(err, business) {
			if(err) res.status(500).json(err.message);
			else if(!business) res.status(500).json("Business not found");
			else {
				var id = business._id;
				console.log(id);
				Events.find({ business_id: id }, function (err, events) {
					if (err) res.status(500).json(err.message);
					else if (!events) res.status(500).json("Something went wrong");
					else {

						EventOccurrences.find({business_id:id}, function(err, eventocc) {
							if(err) res.status(500).json(err.message);
							else if(!eventocc) res.status(500).json("Something went wrong");
							else {
								res.status(200).json({events:events, eventocc:eventocc});
							}
						});
					}
				});
			}

		});
	}
});
	}else {
		res.status(401).json('You are not a logged in business');
	}
}

exports.getDailyEvents = function (req, res) {


		var facilityId = req.params.facilityId;
		Events.find({ facility_id: facilityId}, function (err, events) {
			if (err) res.status(500).json("Something went wrong");
			else if (!events) res.status(500).json("Something went wrong");
			else {
				console.log(events+"eventsss");
				EventOccurrences.find({facility_id: facilityId}, function(err, eventocc) {
					if(err) res.status(500).json("Something went wrong");
					else if(!eventocc) res.status(500).json("Something went wrong");
					else {
						console.log('events/eventocc retrieved for facility');
						Facility.findOne({_id:facilityId}, function(err,facility){
							if(err) res.status(500).json("Something went wrong");
							else {
								console.log(facility.name);
								res.status(200).json({events:events, eventocc:eventocc,name:facility.name});
						}
						});

					}
				});
			}
		});

}

exports.getOccurrences = function (req, res) {

		EventOccurrences.find({ event: req.params.eventId }, function (err, events) {
			if (err || !events) res.status(500).json("Something went wrong");
			else
				{
					console.log(events);
					console.log(events);
					console.log(events);
					console.log(events);
					console.log(events);

					res.status(200).json({eventocc:events});
				}
		});
	}




exports.getAllTimings = function (req, res) {
	if (req.user ) {
	 // EventOccurrences.find({facility_id: req.params.facility_id}, function (err, events) {
		EventOccurrences.find({},function (err, events) {
			if (err || !events) res.status(500).json("Something went wrong");
			else res.status(200).json(events);
		});
	}
	else {
		res.status(401).json('You are not a logged in business');
	}
}

exports.getAllFacilities = function(req,res)
{
	Facility.find({},function(err,facilities)
	{
		if(err)
			res.send("error in get facilities");
		else
			res.json(facilities);
	});
}

/* A business can edit an event or an event occurrence based on the changed field. */

exports.editEvent = function (req, res) {


	if (req.user && req.user instanceof Business && typeof req.params.id != "undefined") {
		var id = req.params.id;
		var business_id = req.user.id;
		var check = 1;
		Events.findById(id, function (err, event) {
			console.log("ana fl event");
			if (err) res.status(500).json("Something went wrong");
			else if (!event) res.status(500).json("Something went wrong");
			else {
				if (event.business_id == business_id) {
					if (typeof req.body.name != "undefined" && req.body.name.length > 0) {
						event.name = req.body.name;
						console.log('Namee'+event.name);
					}

					if (typeof req.body.location != "undefined" && req.body.location.length > 0) {
						event.location = req.body.location;
					}
					if (req.body.price) {
						if(req.body.price < 0){
							return res.status(500).json("Enter a valid price");
						}
						else {
							console.log("Price"+req.body.price);
							event.price = req.body.price;
						}

					}

					if (typeof req.body.description != "undefined" && req.body.description.length > 0) {
						event.description = req.body.description;
					}
					if (req.body.day) {
						event.daysOff = req.body.day;
					}
					if ( req.body.date && req.body.date.length > 0) {
						if (event.repeated == "Once") {
							var now = new Date();
							if(now - (new Date(req.body.date)) >= 0 ){
								return res.status(500).json("Enter a valid date");
							}
							else{
							EventOccurrences.findOneAndUpdate({ event: id }, { $set: { day: req.body.date } }, function (err, occurrence) {
								if (err) res.status(500).json("Something went wrong");
								else if (!occurrence) res.status(500).json("Something went wrong");

							});
						}
					}
					}
					if (typeof req.body.timing != "undefined" && req.body.timing.length > 0) {
						EventOccurrences.update({ event: id }, { $set: { time: req.body.timing } }, { "multi": true }, function (err) {
							if (err) res.status(500).json("Something went wrong");
						});

					}
					console.log("CHECK:" + check);
					if(check){
					event.save(function(err, newevent) {
						if(err) return res.status(500).json("Something went wrong");
						else {
							EventOccurrences.find({event: id}, function(err,occs){
								console.log("BATAAALLLL");
								if(err) res.status(500).json("Something went wrong");
								else if(!occs) res.status(500).json("Something went wrong");
								else return res.status(200).json({event:newevent, eventocc:occs});
							})

						}
					});
				}
				}
				else res.status(500).json("Can not edit this event");
			}

		});
	}
	else {
		res.status(500).json('You are not a logged in business');
	}

}

exports.deleteImage = function(req, res) {
	if(req.user && req.user instanceof Business && typeof req.params.eventId != "undefined" && typeof req.params.image != "undefined") {
		var eventId = req.params.eventId;
		var image = req.params.image;
console.log("ANA FE DELETEIMAGEEVENTT");
		Events.findById(eventId, function(err, event) {
			if(err || !event) res.status(500).json("something went wrong");
			else {
				if(event.business_id == req.user.id) {
					// event.image.pull({image:image});
					// event.save(function(err, updatedEvent) {
					// 	if(err) res.status(500).json("something went wrong");
					// 	console.log("UPDATED EVEENNTTTT:"+updatedEvent);
					// 	res.status(200).json({event:updatedEvent});
					// });
					Events.findByIdAndUpdate(eventId, {$pull:{image:image}}, {safe:true, upsert: true, new:true}, function(err, updatedEvent) {
						if(err) res.status(500).json("something went wrong");
						console.log("UPDATED EVEENNTTTT:"+updatedEvent);
						res.status(200).json({event:updatedEvent});
					});
				} else {
					res.status(500).json("You are not authorized to view this page");
				}
			}
		});
	} else {
		res.status(500).json('You are not authorized to view this page');
	}
}

exports.addImage = function(req, res) {
	if(req.user && req.user instanceof Business && typeof req.params.eventId != "undefined") {
		console.log("hi????????????????");
		var eventId = req.params.eventId;
		console.log(eventId);
		console.log("THIS IS A FILEEEE:"+req.file.filename);
		Events.findById(eventId, function(err, event) {
			if(err || !event){ res.status(500).json("something went wrong"); }
			else {
				if(event.business_id == req.user.id) {
					console.log("??");
					console.log("Fileeee::::::::::::"+req.file);
					Events.findByIdAndUpdate(eventId, {$push: {image: req.file.filename}}, {safe:true, upsert: true, new:true}, function(err, updatedEvent) {
						if(err) res.status(500).json("something went wrong");
						console.log(updatedEvent);
						res.status(200).json({event:updatedEvent});
					});
				} else {
					console.log("lolo");
					res.status(500).json("You are not authorized to view this page");
				}
			}
		});
	} else {
		console.log("koko");
		res.status(500).json('You are not authorized to view this page');
	}
}


/*A business can cancel an event with all its occurrences.*/

exports.cancelEvent = function (req, res,notify_on_cancel) {
	if (req.user && req.user instanceof Business && typeof req.params.id != "undefined") {
		var id = req.params.id;
		var business_id = req.user.id;
		console.log("backend cancel event");
		Events.findById(id, function (err, event) {
			if (!event) res.status(500).json("Something went wrong");
			else
				if (event.business_id == business_id)
				{
					Events.remove({ _id: id }, function (err) {
						if (err) res.status(500).json("Something went wrong");
						else {
							console.log("event removed");
							EventOccurrences.find({event:id},function (err,all_occ) {
								if (err) res.status(500).json("Something went wrong");
								else
									{
										res.status(200).json("deleted");
										async.each(all_occ, function(one_occ, callback)
										{
											one_occ.remove(function(err)
										    {
										   //    if(!err)
										   //    {
											  //     	var bookings = one_occ.bookings;
													// var content = req.user.name + " cancelled " + event.name + "     " + Date.now();

													// async.each(bookings, function(one_booking, cb){
													// 	Bookings.findById({_id:one_booking},function(err,booking)
													// 	{
													// 		User.findByIdAndUpdate({_id:booking.booker},{$push:{"notifications": content}},function(err,user)
													// 		{
													// 			if(err)
													// 				console.log("error updating user notifications");
													// 			else
													// 				console.log(user);
													// 		});
													// 	});
													// });
											  //     	// notify_on_cancel_occ(event.name,one_occ.id,req.user.name);
											  //     	Business.find({_id:business_id},function(err,business){
											  //     		if(err) res.send(err.message);
											  //     		if(!business) console.log("No business");
											  //     		res.json(business);
											  //     	});

										   //    }
										  	  // else
										  	  	// res.send("Something went wrong");

										    });
										});
									 }
							});
						}
					});
				}
				else {
					res.status(500).json("CAN NOT CANCEL THIS EVENT");
				}
		});
	}
	else {
		res.status(500).json('You are not a logged in business');
	}

}


/** Removes all occurence of an event */
exports.removeAllOccurrences = function (event_id) {
	EventOccurrences.remove({ event: event_id }, function (err) {
		if (err)
			res.status(500).json("Something went wrong");
	})
}

/* Abusiness can cancel an event occurrence.*/

exports.cancelOccurrence = function (req, res,notify_on_cancel_occ) {
	if (req.user && req.user instanceof Business && typeof req.params.occId != "undefined") {
		var occurrence_id = req.params.occId;
		var business_id = req.user.id;


		EventOccurrences.findById(occurrence_id, function (err, occ) {
			if (!occ) res.status(500).json("Something went wrong1");

			Events.findById(occ.event, function (err, event) {
				if (!event) res.status(500).json("Something went wrong2");
				else
					if (event.business_id == business_id) {

						EventOccurrences.remove({ _id: occurrence_id }, function (err) {
							if (err) res.status(500).json("Something went wrong3");
							// else
						  //   {
						  //   	var bookings = occ.bookings;
							// 	var content = req.user.name + " cancelled " + event.name + "     " + Date.now();
							//
							// 	async.each(bookings, function(one_booking, cb){
							// 		Bookings.findById({_id:one_booking},function(err,booking)
							// 		{
							// 			User.findByIdAndUpdate({_id:booking.booker},{$push:{"notifications": content}},function(err,user)
							// 			{
							// 				if(err)
							// 					console.log("error updating user notifications");
							// 				else
							// 					console.log(user);
							// 			});
							// 		});
							// 	});
							// 	// notify_on_cancel_occ(event.name,occurrence_id,req.user.name);
							// 	//res.send('occurrence deleted');
							// }
						});

						res.status(200).json("occurrence cancelled");
					}
					else {
						res.status(500).json("Can not cancel this occurrence");
					}
			});
		});
	}
	else {
		res.status(500).json('You are not a logged in business');
	}

}

exports.getOccurrence = function(req, res)
{
	console.log("in node .. occ id is "+req.body.occ_id);
	console.log("req.user is "+req.user);
	if(req.user && req.user instanceof Business)
	{
		EventOccurrences.findById(req.body.occ_id, function(err, occ)
		{
			if(err) return res.status(500).json("ERROR IN FINDING OCC");
			console.log("occ nafsha "+occ);
			console.log("occ.business_id "+occ.business_id );
			console.log(" req.user._id "+ req.user._id);
			if(occ.business_id != req.user.id) return res.status(401).json("YOU ARE NOT AUTORIZED 1");
			return res.status(200).json(occ);
		});
	}
	else
		return res.status(401).json("YOU ARE NOT AUTORIZED 2");
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
