angular.module('fasa7ny')
    .factory('Stats', function ($http) {
        var api = 'http://localhost:3000';
        var factory = {};
        factory.year = function (params) {
            return $http.post('http://localhost:3000/stats/year', params);
        }
        factory.month = function (params) {
            return $http.post('http://localhost:3000/stats/month', params);
        }
        factory.week = function (params) {
            return $http.post('http://localhost:3000/stats/week', params);
        }
        factory.getAllStats = function (params) {
            return $http.post('http://localhost:3000/stats/all', params);            
        }

        var formatDate = function (date) {
            var ans = '';
            var month = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
            ans = ans + month[date.getMonth()];
            ans += ' ';
            ans += date.getYear();
            return ans;
        }
        factory.processData = function (resData, type) {
            var chart = {};
            chart.labels = [];
            chart.data = [];
            var views = [];
            var attend = [];
            var rating = [];
            var sales = [];
            var subs = [];

            for (var i = 0; i < resData.length; i++) {
                if (type == 'year')
                    chart.labels.push(resData[i].year);
                else if (type == 'month')
                    chart.labels.push((resData[i].month + 1) + ' - ' + resData[i].year);
                else if (type == 'week')
                    chart.labels.push(formatDate(new Date(resData[i].startDate)) + ' - ' + formatDate(new Date(resData[i].endDate)));

                views.push(resData[i].views);
                attend.push(resData[i].attendees);
                rating.push(resData[i].rating);
                sales.push(resData[i].sales);
                subs.push(resData[i].subscriptions);
            }
            chart.data.push(views);
            chart.data.push(attend);
            chart.data.push(rating);
            chart.data.push(sales);
            chart.data.push(subs);
            return chart;
        }

        return factory;
    }); 