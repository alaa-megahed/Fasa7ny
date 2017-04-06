
var Events = require('mongoose').model('Events');
var EventOccurrences = require('mongoose').model('EventOccurrences');
var Business = require('mongoose').model('Business');

var async = require("async");
var schedule = require('node-schedule');

/* This function creates an event. An event can have two types Once or Daily specified by "repeated". 
The function creates an event and save it in the database. If it is Daily then 30 instances of event occurrences 
will be created and saved in the database. Then I initialize a scheduling rule using node scheduler which adds a 
single event occurence next month on a daily basis. 
If the type is Once only one event occurrence is added.
*/


exports.createEvent = function (req, res) {

	if (req.user && req.user instanceof Business) {
		var id = req.user.id;

    	
    	if(!req.body.name || !req.body.description || !req.body.location || !req.body.price || !req.body.capacity || !req.body.repeat) {
     
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
				location:req.body.location,
				price:req.body.price,
				capacity:req.body.capacity,
				repeated: req.body.repeat,
				daysOff: req.body.day,
				business_id: id

				});

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

						for (l = 0; l < req.body.day.length; l++) {
							var y = Number(req.body.day[l]);

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

						var flag = true;

						for (i = 0; i < req.body.day.length; i++) {
							var x = Number(req.body.day[i]);

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
							if (err) res.send(err.message);

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

exports.cancelEvent = function (req, res) {
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
							EventOccurrences.remove({ event: id }, function (err) {
								if (err) res.send('could not delete occurrence');
								else res.send('Event cancelled');
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

exports.cancelOccurrence = function (req, res) {
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
							else res.send('occurrence deleted');
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

