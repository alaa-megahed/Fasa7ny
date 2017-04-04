
var Events = require('mongoose').model('Events');
var EventOccurrences   = require('mongoose').model('EventOccurrences');

/* This function creates an event. An event can have two types Once or Daily specified by "repeated". 
The function creates an event and save it in the database. If it is Daily then 30 instances of event occurrences 
will be created and saved in the database. Then I initialize a scheduling rule using node scheduler which adds a 
single event occurence next month on a daily basis. 
If the type is Once only one event occurrence is added.
*/


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


             if(req.body.repeat == "Once"){
             	

             	let occurrence = new EventOccurrences({
					day:req.body.date,
					time: req.body.timing,
					available: req.body.capacity,
					event: event._id
				});

             		occurrence.save(function(err,occurrence){
					if(err) res.send(err.message);
					
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

/* A business can edit an event or an event occurrence based on the changed field. */		

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
		// }
		// else{
		// 	console.log('not logged in');
		// }
			

		}
		
		/*A business can cancel an event with all its occurrences.*/

		exports.cancelEvent = function(req,res){
			// if(req.user){
			var id = req.body.id;

			Events.remove({_id:id}, function(err){
				if(err) console.log('could not delete event');
				else console.log('event deleted');
			});

			EventOccurrences.remove({event:id}, function(err){
				if(err) console.log('could not delete occurrence');
				else console.log('occurrence deleted');
			});

			res.render('eventCreated.ejs');
		// }
		// else{
		// 	console.log('not logged in');
		// }

		 }

		 /* Abusiness can cancel an event occurrence.*/

		exports.cancelOccurrence = function(req,res){
			// if(req.user){
			var id = req.body.id;

			EventOccurrences.remove({_id:id}, function(err){
				if(err) console.log('could not delete occurrence');
				else console.log('occurrence deleted');
			});

			res.render('eventCreated.ejs');
		// }
		// else{
		// 	console.log('not logged in');
		// }

		}

