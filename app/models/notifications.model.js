var mongoose = require('mongoose'),
      Schema = mongoose.Schema;


var NotificationSchema = new Schema({

	content   : String,
	date      : Date,
	read_flag : {type: Number, default: 0} // 0 means unread notification

});	

var Notifications = mongoose.model('Notifications', NotificationsSchema);
module.exports = Notifications;
