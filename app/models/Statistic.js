var mongoose = require('mongoose'),
  Schema = mongoose.Schema;


var weekStat = new Schema({
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
  }
});

var monthStat = new Schema({
  month: Number,
  year: Number,
  subscriptions: Number,
  sales: Number, //total amount of money recieved
  averageRating: Number,
  attendees: Number,
  views: Number,
  business:
  {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'business'
  }
});

var yearStat = new Schema({
  month: Number,
  year: Number,
  subscriptions: Number,
  sales: Number, //total amount of money recieved
  averageRating: Number,
  attendees: Number,
  views: Number,
  business:
  {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'business'
  }
});

var WeekStat = mongoose.model('WeekStat', weekStat);
var MonthStat = mongoose.model('MonthStat', monthStat);
var YearStat = mongoose.model('YearStat', yearStat);

module.exports = {
  WeekStat: WeekStat,
  MonthStat: MonthStat,
  YearStat: YearStat,

};
