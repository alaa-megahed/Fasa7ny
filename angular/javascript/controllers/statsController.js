angular.module('fasa7ny')
    .controller('StatsController', function ($scope, Stats) {
        $scope.businessID = '58f0f8312ffb434813227cc0';
        $scope.title = 'Statistics';
        $scope.disableButton = ($scope.type == 'year' && $scope.startYear > $scope.endYear);
        $scope.series = ['Views', 'Attendees', 'Rating', 'Sales', 'Subscriptions'];

        $scope.getStats = function () {
            if ($scope.type == 'year') {
                Stats.year({ businessID: $scope.businessID, startYear: +$scope.startYear, endYear: +$scope.endYear })
                    .then(function (res) {
                        $scope.title = 'Yearly Statistics';
                        //clearing data and labels 
                        $scope.labels = [];
                        $scope.data = [];
                        var resData = res.data;
                        var chart = Stats.processData(resData, 'year');
                        $scope.data = chart.data;
                        $scope.labels = chart.labels;
                    });
            } else if ($scope.type == 'month') {
                Stats.month({
                    businessID: $scope.businessID,
                    startYear: +$scope.startYear,
                    endYear: +$scope.endYear,
                    startMonth: +$scope.startMonth - 1,
                    endMonth: +$scope.endMonth - 1
                })
                    .then(function (res) {
                        $scope.title = 'Monthly Statistics';
                        //clearing data and labels 
                        $scope.labels = [];
                        $scope.data = [];
                        var resData = res.data;
                        var chart = Stats.processData(resData, 'month');
                        $scope.data = chart.data;
                        $scope.labels = chart.labels;
                    })
            } else if ($scope.type == 'week') {
                Stats.week({
                    businessID: $scope.businessID,
                    startDate: $scope.startDate,
                    endDate: $scope.endDate
                }).then(function (res) {
                    $scope.title = 'Monthly Statistics';
                    //clearing data and labels 
                    $scope.labels = [];
                    $scope.data = [];
                    var resData = res.data;
                    var chart = Stats.processData(resData, 'week');
                    $scope.data = chart.data;
                    $scope.labels = chart.labels;
                });
            }
        }

        $scope.onClick = function (points, evt) {
            console.log(points, evt);
        };
        $scope.datasetOverride = [
            { yAxisID: 'y-axis-1' },
            { yAxisID: 'y-axis-2' },
            { yAxisID: 'y-axis-3' },
            { yAxisID: 'y-axis-4' },
            { yAxisID: 'y-axis-5' }

        ];
        $scope.options = {
            scales: {
                yAxes: [
                    {
                        id: 'y-axis-1',
                        type: 'linear',
                        display: true,
                        position: 'left'
                    },
                    {
                        id: 'y-axis-2',
                        type: 'linear',
                        display: true,
                        position: 'left'
                    },
                    {
                        id: 'y-axis-3',
                        type: 'linear',
                        display: true,
                        position: 'right'
                    },
                    {
                        id: 'y-axis-4',
                        type: 'linear',
                        display: true,
                        position: 'right'
                    },
                    {
                        id: 'y-axis-5',
                        type: 'linear',
                        display: true,
                        position: 'right'
                    }
                ]
            }
        };


    });

