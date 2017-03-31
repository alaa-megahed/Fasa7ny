var mongoose = require('mongoose');
var Booking = mongoose.model('Booking');
var Events = mongoose.model("Events");
var EventOcc = mongoose.model('EventOccurrences');
var RegisteredUser = mongoose.model('RegisteredUser');
var passport = require('passport');



// var event_ = new Events
// {
//   name = "lollapalozza"
// }
//
// event_.save();
//
// var eventocc = new EventOcc(
// {
//   available : 20
// });
//
// eventocc.save();
//



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

             EventOcc.findOneAndUpdate({_id:req.body.event}, {"$push" : {"bookings": booking}}, function(err,eve){
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


exports.regUserDeleteBookings = function(req,res,next){

  // if(req.user)
  // {

    Booking.findByIdAndRemove(req.body.booking, function(err,booking){
      if(err) throw err;
      RegisteredUser.findByIdAndUpdate(req.body.id, {"$pull" : {bookings: req.body.booking}}, function(err,booking){
        if(err) throw err;
      })
      EventOcc.findByIdAndUpdate(booking.event_id, {"$pull" : {bookings: req.body.booking}}, function(err,booking){
        if(err) throw err;
        res.send(booking);
      })

    });


  // }
  // else
  // {
  //   res.send("Please log in to delete bookings");
  // }

}
