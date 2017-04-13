var mongoose = require('mongoose');
var WeekStat = mongoose.model('WeekStat');
var MonthStat = mongoose.model('MonthStat');
var YearStat = mongoose.model('YearStat');

var StatsController = {

}

var helper {
  /*
    Calculate the start and end dates of this week
  */
  calculateWeek: function(date) {
    var month = date.getMonth() + 1; //function returns (0-11)
    var year = date.getFullYear();
    var dayOfWeek = date.getDate();
    var dayOfMonth = date.getDate();

    //calculate the start of this week
    var startDate = new Date();
    var startDay = dayOfMonth - dayOfWeek;
    var startMonth = month;
    var startYear = year;

    //if start of this week goes into last month
    if(startDay < 0) {
      //if it goes into last year
      if(month == 1) {
        startYear = year - 1;
        startMonth = 12;
        startDay = 31 - startDay;
      } else {
        startMonth = month - 1;
        startDay = this.daysOfMonth(month - 1, year);
      }
    }
    startDate.setDate(startDay);
    startDate.setMonth(startMonth - 1);
    startDate.setFullYear(startYear);

    //calculate end date of this week
    var endDate = new Date();
    var thisMonth = this.daysOfMonth(month);
    var endDay = (dayOfMonth + (6 - dayOfWeek)) % thisMonth;
    var endMonth = month;
    var endYear = year;
    if(endDay < endDate.getDate()) {
      endMonth++;
      if(endMonth == 13) {
        endMonth = 1;
        endYear++;
      }
    }

    endDate.setDate(endDay);
    endDate.setMonth(endMonth - 1);
    endDate.setFullYear(endYear);

    return {
      startDate: startDate,
      endDate: endDate
    }

  },
  /*
  Calculate the number of days of a month,
  keeping into consideration leaps years
*/
  daysOfMonth: function(month, year) {
    if(month == 1 || month == 3 || month == 5 || month == 7 || month == 8 || month == 10 || month == 12) {
      return 31;
    } else if(month == 2) {
      if(leapYear(year)) {
        return 29;
      } else {
        return 28;
      }
    } else {
      return 30;
    }
  },

  leapYear(year) {
    if((year%4 == 0 ) && ((year%100 != 0) || (year%400 == 0)))
      return true;
    else
      return false;
  }
}
