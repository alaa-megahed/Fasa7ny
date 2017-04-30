angular.module('fasa7ny')
    .controller('SearchController', function ($scope, Search, $routeParams, $location, IP) {
        $scope.ip = IP.address;
        console.log($scope.ip);

        if ($routeParams.keyword == 'undefined')
            $scope.keyword = '';
        else

            $scope.keyword = $routeParams.keyword;
        $scope.minRating; //default min rating is zero 
        $scope.direction = true; //default sorting is descending
        $scope.cat = ''; //default category is all 
        $scope.sortBy = ''; //default is no sort 
        $scope.area = ''; //default area is all 
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

        /**
         * Divide array into chunks of length 4
         */
        function chunk(arr, size) {
            var newArr = [];
            for (var i = 0; i < arr.length; i += size) {
                newArr.push(arr.slice(i, i + size));
            }
            return newArr;
        }

        /**
         * Get all business whose public = 1, and divide them into chunks of length 4 for better display
         */
        Search.get()
            .then(function (res) {
                $scope.businesses = res.data;
                $scope.chunkedBusinesses = chunk($scope.businesses, 4);
            }, function (res) {
                alert(res.data);
            });


        //===================
        //REDIRECT TO BUSINESS PAGE
        //===================
        $scope.goToBusinessPage = function (business) {
            console.log('clicked');

            $location.path('/business/' + business.name);
        }

    }); 