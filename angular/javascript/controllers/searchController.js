angular.module('fasa7ny')
    .controller('SearchController', function($scope, $http) {
        $http.get('/search/showAll', function(res) {
            $scope.businesses = 'bala7'; 
        }); 
    }); 