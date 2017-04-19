var mongoose = require('mongoose');
var WeekStat = mongoose.model('WeekStat');
var MonthStat = mongoose.model('MonthStat');
var YearStat = mongoose.model('YearStat');
var AllStat = mongoose.model('AllStat');
var schedule = require('node-schedule');
var Business = require('../models/Business');
var StatsController = {
  /**
    updates the statistics related to the given businessID,
    in the WeekStats, MonthStats and YearStats
  */
  addStat: function (date, businessID, statType, amount) {
    var now = date;
    now.setHours(0, 0, 0, 0);

    //update week stats
    //check if there is an entry for this business for this week
    WeekStat.findOne({
      startDate: { $lte: now },
      endDate: { $gte: now },
      business: businessID
    }).exec(function (err, stat) {
      if (err) throw err;
      if (stat != null) { //if there is an entry -> update it
        var query = helper.updateQuery(stat, statType, amount);
        stat.update(query).exec(function (err, result) {
          if (err)
            throw err;
          else
            console.log(result);
        });
      } else { //if there is no entry for this business for this week -> create one
        var newWeekStat = new WeekStat();
        var week = helper.calculateWeek(now);
        newWeekStat.startDate = week.startDate;
        newWeekStat.endDate = week.endDate;
        newWeekStat.business = businessID;
        newWeekStat[statType] = amount;
        console.log(newWeekStat);

        newWeekStat.save(function (err) { if (err) { throw err; } });
      }
    });
    console.log(now);

    MonthStat.findOne({
      business: businessID,
      month: now.getMonth(),
      year: now.getFullYear()
    }).exec(function (err, stat) {
      if (err) throw err;
      else {
        if (stat != null) {
          var query = helper.updateQuery(stat, statType, amount);
          stat.update(query).exec(function (err, result) {
            if (err)
              throw err;
            else
              console.log(result);
          });
        } else {
          var newMonthStat = new MonthStat();
          newMonthStat.month = now.getMonth();
          newMonthStat.year = now.getFullYear();
          newMonthStat.business = businessID;
          newMonthStat[statType] = amount;
          console.log(newMonthStat);

          newMonthStat.save(function (err) { if (err) throw err; });
        }
      }
    });

    YearStat.findOne({
      business: businessID,
      year: now.getFullYear()
    }).exec(function (err, stat) {
      if (err) throw err;
      else {
        if (stat != null) {
          var query = helper.updateQuery(stat, statType, amount);
          console.log(query);
          stat.update(query).exec(function (err, result) {
            if (err)
              throw err;
            else
              console.log(result);
          });
        } else {
          var newYearStat = new YearStat();
          newYearStat.year = now.getFullYear();
          newYearStat.business = businessID;
          newYearStat[statType] = amount;
          console.log(newYearStat);

          newYearStat.save(function (err) { if (err) throw err; });
        }
      }
    });
    AllStat.findOne({ business: businessID }, function (err, stat) {
      if (stat != null) {
        var query = helper.updateQuery(stat, statType, amount);
        console.log(query);
        stat.update(query).exec(function (err, result) {
          if (err)
            throw err;
          else
            console.log(result);
        });
      } else {
        var newAllStat = new AllStat();
        newAllStat.business = businessID;
        newAllStat.save(function (err) { if (err) throw err; });
      }
    });
  },
  schedule: function (businessID) {
    var rule = new schedule.RecurrenceRule();
    rule.dayOfWeek = 6;
    rule.hour = 23;
    rule.minute = 59;
    rule.second = 50;
    schedule.scheduleJob(rule, function () {
      that = this;
      that.addStat(new Date(), businessID, 'views', 1);
    });
  },
  getWeekStats: function (req, res) {

    var businessID = req.body.businessID;
    var startDate = helper.calculateWeek(new Date(req.body.startDate)).startDate;
    var endDate = helper.calculateWeek(new Date(req.body.endDate)).endDate;
    WeekStat.find({
      $or: [
        { startDate: { $gte: startDate } },
        { endDate: { $lte: endDate } },
      ],
      business: businessID
    }, function (err, result) {
      if (err) {
        console.log(err);
      }
      else {
        console.log(result);
        res.json(result);
      }
    });


  },
  getMothStats: function (req, res) {
    console.log(req.body);

    var businessID = req.body.businessID;
    var startMonth = parseInt(req.body.startMonth);
    var startYear = parseInt(req.body.startYear);
    var endMonth = parseInt(req.body.endMonth);
    var endYear = parseInt(req.body.endYear);

    var query = MonthStat.find({
      $or: [
        {
          $and: [
            { year: { $gt: startYear } },
            { year: { $lt: endYear } }
          ]
        },
        {
          $and: [
            { year: startYear },
            { month: { $gte: startMonth } }
          ]
        },
        {
          $and: [
            { year: endYear },
            { month: { $lte: endMonth } }
          ]
        }
      ],

      business: businessID
    }).sort({ year: 1, month: 1 });
    query.exec(function (err, result) {
      if (err)
        throw err;
      else {
        console.log(result);
        res.json(result);

      }
    });


  },
  getYearStats: function (req, res) {

    var businessID = req.body.businessID;
    var startYear = parseInt(req.body.startYear);
    var endYear = parseInt(req.body.endYear);
    var query = YearStat.find({
      year: { $gte: startYear, $lte: endYear },
      business: businessID
    }).sort('year');

    query.exec(
      function (err, result) {
        if (err) {
          console.log(err);
          res.send('Could not retrieve statistics.');
        } else {
          res.json(result);
        }
      });
  }
}


var helper = {
  /*
    Calculate the start and end dates of this week,
    that is the date of last Sunday and next Saturday
  */
  calculateWeek: function (date) {
    var month = date.getMonth(); //function returns (0-11)
    var year = date.getFullYear();
    var dayOfWeek = date.getDay();
    var dayOfMonth = date.getDate();


    //calculate the start of this week
    var startDate = new Date();
    var startDay = dayOfMonth - dayOfWeek;
    var startMonth = month;
    var startYear = year;


    //if start of this week goes into last month
    if (startDay < 0) {
      //if it goes into last year
      if (month == 0) {
        startYear = year - 1;
        startMonth = 11;
        startDay = 31 + startDay;
      } else {
        startMonth = month - 1;
        startDay = this.daysOfMonth(startMonth, year) + startDay;

      }
    }
    // console.log(startDate); 
    // console.log(startDate.setMonth(startMonth));
    startDate.setMonth(startMonth);
    startDate.setDate(startDay);
    startDate.setFullYear(startYear);
    startDate.setHours(0, 0, 0, 0);

    //calculate end date of this week
    var endDate = new Date();
    var thisMonth = this.daysOfMonth(month);
    var endDay = (dayOfMonth + (6 - dayOfWeek)) % thisMonth;
    console.log(endDay);
    var endMonth = month;
    var endYear = year;
    if (endDay < date.getDate()) {
      endMonth++;
      if (endMonth == 12) {
        endMonth = 0;
        endYear++;
      }
    }



    endDate.setDate(endDay);
    endDate.setMonth(endMonth);
    endDate.setFullYear(endYear);
    endDate.setHours(0, 0, 0, 0);
    console.log(startDate);
    console.log(endDate);

    return {
      startDate: startDate,
      endDate: endDate
    }

  },
  /*
  Calculate the number of days of a month,
  keeping into consideration leaps years
*/
  daysOfMonth: function (month, year) {
    if (month == 0 || month == 2 || month == 4 || month == 6 || month == 7 || month == 9 || month == 11) {
      return 31;
    } else if (month == 1) {
      if (this.leapYear(year)) {
        return 29;
      } else {
        return 28;
      }
    } else {
      return 30;
    }
  },

  leapYear: function (year) {
    if ((year % 4 == 0) && ((year % 100 != 0) || (year % 400 == 0)))
      return true;
    else
      return false;
  },
  updateQuery: function (stat, statType, amount) {
    var query = {};
    if (statType == 'rating') {
      query['rating'] = amount;
    } else {
      var inc = {};
      inc[statType] = amount;
      query['$inc'] = inc;
    }
    return query;
  }
}

module.exports = StatsController; 