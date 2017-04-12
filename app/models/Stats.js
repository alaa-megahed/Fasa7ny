var mongoose = require('mongoose'),
  Schema = mongoose.Schema;


var statsSchema = new Schema({
  range: {
    type: String,
    enum: ['week', 'month', 'year']
  },
  startDate: Date,
  endDate: Date, //used only with
  subscriptions: Number,
  sales: Number, //total amount of money recieved
  averageRating: Number,
  attendees: Number,
  views: Number,
  business:
  {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'business'
  },
});
