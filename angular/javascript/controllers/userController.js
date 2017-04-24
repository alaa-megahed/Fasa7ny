
var app = angular.module('fasa7ny');

app.controller('userController', function($scope, status,$http, User, $location, $routeParams, $modal, $window) {

	$scope.user = {};
	  
	status.local()
  	.then(function(res){
    if(res.data){
      if(res.data.user_type == 1){
      	$scope.type = 1;
      	$scope.user = res.data;
      }
        
      else if(res.data.user_type == 2)
        $scope.type  = 4;
      else $scope.type = 3;
    }
    else {
      status.foreign()
      .then(function(res){
        if(res.data.user_type){
          $scope.type = 1;
          $scope.user = res.data;
        }
        else $scope.type = 2;
      });
    }
  });

	$scope.bookings ;
	// User.getUserDetails($scope.id).then(function(d) {
	// 	//console.log(d.data.user);
	// 	//console.log("line 6 userController");
 //    	$scope.user = d.data.user;

    	//$scope.subscribed_businessesIDs = d.data.user.subscriptions;
    	// $scope.subscribed_businessesIDs = ["58f6b2cea97a083153a0d256", "58f6b43f5f77f0316cec84b3"];
    	$scope.subscribed_businesses = [];
		for(i = 0; i < $scope.user.subscriptions.length; i++) {
			User.getSubscribedBusiness($scope.user.subscriptions[i]).then(function(d) {		
				$scope.subscribed_businesses.push(d.data);
			});
		}    	



    	//$scope.bookings = d.data.user.bookings;
    	// $scope.bookings = ["58f758db36646333e9fd6ec0", "58f758f236646333e9fd6ec1"];
    	$scope.all_info = [];
		for(i = 0; i < $scope.user.bookings.length; i++) {
			//console.log("This is scope bookings[i]" + $scope.bookings[i]);
			User.getBookingDetails($scope.user.bookings[i]).then(function(d) {		
				//console.log($scope.bookings[i])	;
				$scope.all_info.push(d.data);
			});
		}


	// });


	$scope.goToEditProfile = function(userID) {
			var modalInstance = $modal.open({
					templateUrl: 'views/user_edit_profile.html',
					controller: EditProfileCtrl,
					scope: $scope,
					resolve: {
							userID: function() {
								return userID;
							}
					}
			});

			modalInstance.result.then(function (selectedItem) {
					$scope.selected = selectedItem;
			}, function () {
					$log.info('Modal dismissed at: ' + new Date());
			});
	}

	$scope.changeImage = function(userID) {
		console.log("ana fl change image controller")
		User.changeImage(userID,$scope.formData).then(function(d) {
			console.log("done changeImage");
			$window.location.reload();
		});
	}

});





var EditProfileCtrl = function ($scope, $modalInstance, userID, User, $route) {
    $scope.form = {};
    $scope.formData = {}
    $scope.submitForm = function () {
        // if ($scope.form.editForm.$valid) {
            console.log('user form is in scope');
			console.log($scope.formData);
			User.editUserInfo(userID, $scope.formData) .then(function(d) {
				console.log("done editing user");
			});
			$route.reload();
            $modalInstance.close('closed');
    };

    $scope.cancel = function () {
        $modalInstance.dismiss('cancel');
    };
};


