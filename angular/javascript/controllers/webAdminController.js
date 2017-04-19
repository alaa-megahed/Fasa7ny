angular.module('fasa7ny').controller('webAdminController', function($scope,$http)
	{



   $scope.addBusiness = function()
   {
     $http.post('http://127.0.0.1:3000/admin/add_business', $scope.business).then(function(response){
     	console.log(business);
     }, function(failureResponse)
     {
     	
     })
   }
	});