angular.module('searchController')
    .controller('main', function($scope, $http) {
        $http.get('/search/showAll', function(res) {
            $scope.businesses = 'bala7'; 
        }); 
    }); 