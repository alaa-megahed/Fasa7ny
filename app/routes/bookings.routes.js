var bookings= require('../../app/controllers/bookings.controller');



module.exports = function(app,passport,multer) {

  app.post('/createRegUserBookings', bookings.regUserAddBooking);

  app.post('/viewRegUserBookings', bookings.regUserViewBookings);

  app.post('/deleteRegUserBookings', bookings.regUserDeleteBookings);





}
