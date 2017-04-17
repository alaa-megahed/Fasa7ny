angular.module('fasa7ny')
    .controller('SearchController', function ($scope, $http) {
        $scope.minRating = 0;
        $scope.direction = true;
        $scope.cat = 'all';
        $scope.businesses = 'No results.';
        $scope.checked = false;
        $scope.sortBy = ""; 
        $scope.check = function () {
            if ($scope.checked) {
                console.log('habal');

                $scope.direction = false;
            } else {
                $scope.direction = true;
            }
        }

        $http.get('http://127.0.0.1:3000/search')
            .then(function (res) {
                console.log(res.d)
                $scope.businesses = res.data;
            });



    }); 