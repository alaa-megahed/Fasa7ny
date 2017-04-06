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

     if(!form.count) res.send("please enter count");
     else count = form.count;    

    var event_id = req.body.event_id;   

    //Create booking instance 
    var booking  = new Booking     
    ({
        booking_date : new Date(),
        count        : count,
        event_id     : event_id,
        booker       : req.user.id  
    });


      // Insert booking in array of bookings of booked event occurrence
      EventOccurrences.findById(event_id,function(err, eventocc)
      {
           if(err)
               console.log(err);
            else
            {
                  //cannot book more than available number
                  if(eventocc.available < count)
                  {
                     res.send("capacity doesn't allow more than "+eventocc.available);
                  }
                  
                  else
                  {
                    //update number of available bookings in event occurrence by subtracting 
                    // the number of people in booking (count) and the available.
                    booking.save(function(err,booking)
                    {
                      var newAvailable = eventocc.available - booking.count;
                      EventOccurrences.findByIdAndUpdate(event_id,{$set:{"available":newAvailable},$push: {"bookings": booking}},{safe: true, upsert: true, new : true}, 
                      function(err,eventoccur)
                      {
                        if(err)
                          res.send("Oops, something went wrong, please try again with the correct information ");
                        else
                          res.send("Booked successfully");
                      });
                    });
                    
                  }       
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
    var bookingID  = req.body.booking_id;  //booking to be edited       
    var new_date   = new Date();
    var newCount   = req.body.count1;
    
       // get booking 
       Booking.findById(bookingID,function(err,booking)
        {
          if(err)
             res.send("Oops, something went wrong, please try again with the correct information "+booking);
          else
          {
            // get event occurrence of this booking
            EventOccurrences.findById(booking.event_id, function(err,eventocc)
            {
               if(err)
                     res.send("Oops, something went wrong, please try again with the correct information "+booking);
                else
                {
                  //get event of event occurrence
                  Events.findById(eventocc.event,function(err,event)
                  {
                    var business = event.business_id;

                    //check if this booking belongs to business currently manipulating it
                    if(business != req.user.id)
                        res.send("You do not have authority to access this page"+business+" "+req.user.id);
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
                                if(err)
                                  res.send("Oops, something went wrong, please try again with the correct information "+booking);
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
    var event_id  = req.body.event_id;        //event_id of booking to be cancelled 


     // get booking 
        Booking.findById(bookingID,function(err,booking)
        {
          if(err)
             res.send("Oops, something went wrong, please try again with the correct information "+booking);
          else
          {
            // get event occurrence of this booking
            EventOccurrences.findById(booking.event_id, function(err,eventocc)
            {
               if(err)
                     res.send("Oops, something went wrong, please try again with the correct information "+booking);
                  else
                  {
                    //get event of event occurrence
                    Events.findById(eventocc.event,function(err,event)
                    {

                       var business = event.business_id;

                       //check if this booking belongs to business currently manipulating it
                       if(business != req.user.id)
                          res.send("You do not have authority to access this page");
                        else
                        {
                             
                           Booking.findByIdAndRemove(bookingID,function(err,booking)
                            {
                              if(err)
                                res.send(err);
                              else
                              {
                                 EventOccurrences.findByIdAndUpdate(event_id,{ $pull: {bookings: bookingID}},
                                  function(err,eventocc)
                                   {
                                    if(err)
                                      console.log(err);
                                     else
                                     {
                                       if(!eventocc) //handling null exception
                                          res.send("Oops, something went wrong, please try again with the correct information");
                                        else
                                        {  
                                          eventocc.available = eventocc.available + booking.count;
                                          eventocc.save();
                                          res.send("Booking cancelled");
                                         }
                                     }
                                 });

                                }
                            });
                                                     
                                 
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
        if(err)
          res.send("Oops, something went wrong, please try again with the correct information ");
        else
        {
          Events.findById(eventocc.event,function(err,event)
          {   
              //check if this event belongs to business currently viewing its bookings
              if(event.business_id == req.user.id)
              {
                EventOccurrences.findOne({_id:event_id}).populate('bookings').exec(function(err,bookings)
                {
                    res.send(bookings);
                });
              }
              else
              {
                 res.send("You do not have authority to access this page");
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
