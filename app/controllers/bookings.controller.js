var mongoose = require('mongoose');
var Booking = mongoose.model('Booking');
var Event = mongoose.model('specialEvent');
var RegisteredUser = mongoose.model('RegisteredUser');
var passport = require('passport');



exports.regUserAddBooking = function(req, res, next) {

  // if(req.user)
  // {
    var date = new Date();
    console.log(req.body.count+10);
    var booking = new Booking
      {
        count        = req.body.count,
        booker       = req.body.id, //change to req.user.id after serialization
        event_id     = req.body.event,
        booking_date = date
      };

    booking.save(function(err,booking) {
        if (!err) {
          console.log(booking);

          //finds registered user and adds this event to his/her list of bookings
            RegisteredUser.findOne({_id:req.body.id}, function(err, user){

              console.log(user +" " + req.body.id);

              if(err)
                res.send("I hit an error");
                else {
                  user.bookings.push(booking._id);
                  user.save();
                }

            });
            //decreases capacity of event
            // Event.findOneAndUpdate({_id:req.body.event}, {available:available-req.body.count}, function(err,eve){
            // });



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
  console.log("here");
  // if(req.user)
  // {



    Booking.findByIdAndRemove(req.body.booking, function(err,booking){
      if(err) throw err;
      RegisteredUser.findByIdAndUpdate(req.body.id, {"$pull" : {bookings: req.body.booking}}, function(err,booking){
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
