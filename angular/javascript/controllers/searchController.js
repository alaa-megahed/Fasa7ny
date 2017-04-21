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
                console.log('habal');

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


        // $scope.chunkedBusinesses = chunk($scope.businesses, 4);
        // console.log($scope.chunkedBusinesses);


    }); 