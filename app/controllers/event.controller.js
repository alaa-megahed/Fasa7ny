
var Events = require('mongoose').model('Events');
var User   = require('mongoose').model('RegisteredUser');
var EventOccurrences = require('mongoose').model('EventOccurrences');
var Notifications    = require('mongoose').model('Notifications');


	exports.createEvent = function(req,res){
		
		// if(req.user){
		let event = new Events({
			name:req.body.name,
			description:req.body.description,
			location:req.body.location,
			price:req.body.price,
			capacity:req.body.capacity,
			repeated: req.body.repeat,
			daysOff: req.body.day

			});

			 if(typeof req.file == "undefined"){
                event.image = " ";
            }
            else{
                event.image = req.file.filename;
            }


            event.save(function(err,event){
                if(err) res.send(err.message);
               
            });

             if(req.body.repeat == "Daily"){

				var now = new Date();
				var arr = [];

				for(var i = 0; i < 30;) {
  					now.setDate(now.getDate() + 1);
  					var tflag = true;

				for(l=0; l<req.body.day.length;l++){
					var y = Number(req.body.day[l]);
					
					if(y == now.getDay()){
						tflag = false;
					}
				}
				if(tflag){
					arr[i] = new Date(now);
					i++;
				}
					}

					

				async.each(arr, function (date, callback) {

  				      		
  				let occurrence = new EventOccurrences({
    				day:date,
    				time: req.body.timing,
    				available: req.body.capacity,
    				event: event._id
  				});
  				occurrence.save(function(err,occurrence){
   				 if(err) res.send(err.message);
    				
  				});
				}, function (error) {
  				if (error) res.json(500, {error: error});
				});

            	var rule = new schedule.RecurrenceRule();
				rule.dayOfWeek = [new schedule.Range(0, 6)];
				rule.hour = 0;
				rule.minute = 0;
				

				var j = schedule.scheduleJob(rule, function(){
  				var d = new Date();
				var n = d.getMonth();
				
				
				d.setMonth((n+1)%12);
				var day = d.getDay();

				let occurrence = new EventOccurrences({
					day:d,
					time: req.body.timing,
					available: req.body.capacity,
					event: event._id
				});
				
				var flag = true;

				for(i=0; i<req.body.day.length;i++){
					var x = Number(req.body.day[i]);
					
					if(x == day){
						flag = false;
					}
				}

				if(flag){
				occurrence.save(function(err,occurrence){
					if(err) res.send(err.message);
					
				});
			}

				});

             }


             if(req.body.repeat == "Once")
             {
             	

             	let occurrence = new EventOccurrences({
					day:req.body.date,
					time: req.body.timing,
					available: req.body.capacity,
					event: event._id
				});

             		occurrence.save(function(err,occurrence){
					if(err)
						 res.send(err.message);
					else
					{
						this.notify_on_create(function(err) //notify user when creating event
		             	{
		             		if(err)
		             			console.log("error notifying users");
		             		else
		             			console.log("successfully notified");

		             	});
					}


					
				});

             	
             }


		
		res.render('eventCreated.ejs');
	}
// }
	// else{
	// 	console.log('not logged in');
	// }
	

		exports.getEvents = function(req,res){
			Events.find({},function(err,events){
				if(err) res.send(err.message);
				else res.render('index',{events:events});
			})
			
		}

		exports.getOccurrences = function(req,res){
			EventOccurrences.find({},function(err,events){
				if(err) res.send(err.message);
				else res.render('index',{events:events});
			})
			
		}


		exports.editEvent = function(req,res){
			// if(req.user){
			var id = req.body.id;
			if(typeof req.body.name != "undefined" && req.body.name.length > 0){
				Events.findByIdAndUpdate(id,{$set:{name:req.body.name}}, function(err,event){
					if(err) res.send('Could not update');
					else res.send('name updated');
				});
			}
			if(typeof req.body.location != "undefined" && req.body.location.length > 0){
				Events.findByIdAndUpdate(id,{$set:{location:req.body.location}}, function(err,event){
					if(err) res.send('Could not update');
					else res.send('updated');
				});
			}
			if(typeof req.body.price != "undefined" && req.body.price.length > 0){
				Events.findByIdAndUpdate(id,{$set:{price:req.body.price}}, function(err,event){
					if(err) res.send('Could not update');
					else res.send('updated');
				});
			}
			if(typeof req.body.capacity != "undefined" && req.body.capacity.length > 0){
				Events.findByIdAndUpdate(id,{$set:{capacity:req.body.capacity}}, function(err,event){
					if(err) res.send('Could not update');
					else res.send('updated');
				});
			}

			if(typeof req.body.description != "undefined" && req.body.description.length > 0){
				Events.findByIdAndUpdate(id,{$set:{description:req.body.description}}, function(err,event){
					if(err) res.send('Could not update');
					else res.send('updated');
				});
			}

				if(typeof req.body.day != "undefined" && req.body.day.length > 0){
				Events.findByIdAndUpdate(id,{$set:{daysOff:req.body.day}}, function(err,event){
					if(err) res.send('Could not update');
					else res.send('updated');
				});
			}

			if(typeof req.body.date != "undefined" && req.body.date.length > 0){
				Events.findOne({_id:id},function(err,event){
					if(err) res.send(err.message);
					else{
						if(event.repeated == "Once"){	
							EventOccurrences.findOneAndUpdate({event:id},{$set:{day:req.body.date}},function(err,occurrence){
								if(err) res.send('Could not update');
								else res.send('updated');
							});		
						}
					}
				});

			}

			if(typeof req.body.timing != "undefined" && req.body.timing.length >0 ){
				EventOccurrences.update({event:id},{$set:{time:req.body.timing}},{"multi":true}, function(err){
					if(err) res.send(err.message);
					else res.send('updated');

				});

			}


			  //notify user when editing event if he booked
             


		// }
		// else{
		// 	console.log('not logged in');
		// }
			

		}


		exports.cancelEvent = function(req,res){
			// if(req.user){
			var id = req.query.id;

			Events.remove({_id:id}, function(err){
				if(err) console.log('could not delete event');
				else console.log('event deleted');
			});

			EventOccurrences.remove({event:id}, function(err){
				if(err) console.log('could not delete occurrence');
				else
				{ 
					console.log('occurrence deleted');
					this.notify_on_cancel(function(err)
					{
						if(err)
							console.log("FAILED to notify for cancellation");
						else
							console.log("successfully notified for cancellation");

					});
				}
			});

			res.render('eventCreated.ejs');
		}
		// else{
		// 	console.log('not logged in');
		// }

		// }

		exports.cancelOccurrence = function(req,res){
			// if(req.user){
			var id = req.query.id;

			EventOccurrences.remove({_id:id}, function(err){
				if(err) console.log('could not delete occurrence');
				else
				{ 
					console.log('occurrence deleted');
					this.notify_on_cancel(function(err)
					{
						if(err)
							console.log("FAILED to notify for cancellation");
						else
							console.log("successfully notified for cancellation");

					});
				}
			});

			res.render('eventCreated.ejs');
		// }
		// else{
		// 	console.log('not logged in');
		// }

		}




//================================Notifications=====================================

exports.notify_on_create = function(req,res)
{
	//Notification:  "Business name" just added "event name".
	var subscibers = req.user.subscibers;
	var content = req.user.name + "added" + req.body.name; 
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

			for(var i = 0; i < subscribers.length; i++)
			{
				User.findByIdAndUpdate({_id:subscibers[i]},{$push:{"notifications": notification}},function(err,user)
				{
					if(err)
						console.log("error updating user notifications");
					else
						console.log(user);
				});
			}
		}
	});

}

exports.notify_on_cancel = function(req,res)	//would be exactly the same for edit event but 												
{												//different  notification content, how to check
												// which function am I currently executing	
	event_id = req.query.id; 					//get the event id from session? 
	EventOccurrences.findOne({_id:id},function(err,eventocc)
	{
		if(err)
			console.log("err in notify_on_cancel");
		else
		{
			var bookers = eventocc.bookers;
			var content = req.user.name + "cancelled" + req.body.name; 
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

					for(var i = 0; i < bookers.length; i++)
					{
						User.findByIdAndUpdate({_id:bookers[i]},{$push:{"notifications": notification}},function(err,user)
						{
							if(err)
								console.log("error updating user notifications");
							else
								console.log(user);
						});
					}
				}
			});

		}
	});
}
