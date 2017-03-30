var mongoose = require('mongoose');
var Booking = mongoose.model('Booking');
var Event = mongoose.model('Event');
var RegisteredUser = mongoose.model('RegisteredUser');
var passport = require('passport');


exports.regUserAddBooking = function(req, res, next) {

  if(req.user)
  {
    var booking = new Booking(
      {
        booking_date = new Date(),
        count        = req.body.count ? req.body.count : 1,
        booker       = req.user.id,
        event_id     = req.body.event;
      }
    );

    booking.save(function(err,booking) {
        if (err) {
          //finds registered user and adds this event to his/her list of bookings
            RegisteredUser.findOne(req.user.id, function(err, user){
              user.bookings.push(booking._id);
              user.save();
            });
            //decreases capacity of event
            Event.findOneAndUpdate(req.body.event, capacity:(capacity-req.body.count), function(err,eve){
            });

            return next(err);

        }
        else {
            res.json(user);
        }
    });
  }
  else {
    res.send("Please log in to book events");
  }

};


exports.regUserViewBookings = function(req,res,next){

  if(req.user)
  {
    RegisteredUser.findOne({_id:req.user.id}).populate('bookings').exec(function(err, bookings){
      if(!err)
        res.send(bookings);
    });
  }
  else
  {
    res.send("Please log in to view upcoming bookings.");
  }

};


exports.regUserDeleteBookings = function(req,res,next){

  if(req.user)
  {

  }
  else
  {
    res.send("Please log in to delete bookings");
  }

}
