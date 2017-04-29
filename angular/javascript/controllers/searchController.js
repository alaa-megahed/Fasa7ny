angular.module('fasa7ny')
    .controller('SearchController', function ($scope, Search, $routeParams, IP) {
        $scope.ip = IP.address; 
        if ($routeParams.keyword == 'undefined')
            $scope.keyword = '';
        else
        $scope.keyword = $routeParams.keyword;
        $scope.minRating = 0; //default min rating is zero 
        $scope.direction = true; //default sorting is descending
        $scope.cat = 'all'; //default category is all 
        $scope.sortBy = ''; //default is no sort 
        $scope.area = 'All'; //default area is all 
        $scope.businesses = 'No results.';
        $scope.checked = false;
        $scope.areas = ['New Cairo', 'Maadi', 'Mohandeseen', 'Zamalek'];
        $scope.check = function () {
            if ($scope.checked) {
                $scope.direction = false;
            } else {
                $scope.direction = true;
            }
        }
        function chunk(arr, size) {
            var newArr = [];
            for (var i = 0; i < arr.length; i += size) {
                newArr.push(arr.slice(i, i + size));
            }
            return newArr;
        }
        Search.get()
            .then(function (res) {
                $scope.businesses = res.data;
                $scope.chunkedBusinesses = chunk($scope.businesses, 4);
            }, function (res) {
                alert(res.data);
            });
        
    }); 