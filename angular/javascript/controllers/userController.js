
var app = angular.module('fasa7ny');

app.controller('userController', function($scope, status,$http, User, $location, $routeParams, $modal, $window, $route) {

	$scope.user = {};
	$scope.error = "";
	$scope.booking;
	$scope.pic = "";

	status.local()
  	.then(function(res){
    if(res.data){
      if(res.data.user_type == 1){
      	$scope.type = 1;
      	$scope.user = res.data;
				$scope.pic = $scope.user.profilePic;
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
				User.getBookingDetails($scope.user.bookings[i]).then(function successCallback(d) {
					//console.log($scope.bookings[i])	;
					$scope.all_info.push(d.data);
				}, function errorCallback(d) {
					$scope.error = d.data;
				});
			}
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


	$scope.cancelBooking =function(bookingId)
	{
		$http.post('http://127.0.0.1:3000/bookings/deleteRegUserBookings',{bookingD:bookingId}).then(
			function success(response)
			{
				$route.reload();
				console.log("successful delete");
			},function error(response)
			{
				console.log("error in delete");
			});
	};


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
		console.log("OLD"+$scope.user.profilePic);
		User.changeImage(userID,$scope.formData).then(function successCallback(d) {
			console.log("done changeImage");
			console.log(d.data.user.profilePic);
			$scope.pic = d.data.user.profilePic;
			// $route.reload();


		}, function errorCallback(d) {
			$scope.error = d.data;
		});
	}


	// $scope.cancelBooking = function(bookingId) {
	// 	User.cancelBooking(bookingId).then(function successCallback(d){
	// 		console.log("success");
	// 	}, function errorCallback(d) {
	// 		console.log("error");
	// 	})
	// }

});





var EditProfileCtrl = function ($scope, $modalInstance, userID, User, $route) {
    $scope.form = {};
    $scope.formData = {};
		$scope.error = "";
    $scope.submitForm = function () {
        // if ($scope.form.editForm.$valid) {
            console.log('user form is in scope');
			console.log($scope.formData);
			User.editUserInfo(userID, $scope.formData) .then(function successCallback(d) {
				console.log("done editing user");
				$route.reload();
	      $modalInstance.close('closed');
			}, function errorCallback(d) {
				$scope.error = d.data;
			});
    };

    $scope.cancel = function () {
        $modalInstance.dismiss('cancel');
    };



};
