angular.module('homepage', ['homepageController', 'homepageService']);
angular.module('business', ['businessController', 'businessService']);
angular.module('stats', ['statsController', 'statsService', 'chart']);
angular.module('search').
    controller('searchController', function ($scope, $http) {
        $http.get('/search/showAll', function (res) {
            $scope.businesses = 'bala7';
        });
    });; 