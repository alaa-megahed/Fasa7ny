angular.module('fasa7ny')
    .controller('SearchController', function ($scope, Search) {
        $scope.minRating = 0;
        $scope.direction = true;
        $scope.cat = 'all';
        $scope.businesses = 'No results.';
        $scope.checked = false;
        $scope.sortBy = "";
        $scope.areas = ['New Cairo', 'Maadi', 'Mohandeseen', 'Zamalek'];
        $scope.check = function () {
            if ($scope.checked) {
                $scope.direction = false;
            } else {
                $scope.direction = true;
            }
        }
        Search.get()
            .then(function (res) {
                console.log(res.data);
                $scope.businesses = res.data;
            });



    }); 