var app = angular.module('fasa7ny');


//========== View ===========
app.controller('ViewOffersController', function($scope, $http, $location, Offers,$routeParams) {

      $scope.name = $routeParams.name;
      $http.post('http://127.0.0.1:3000/business/getBusinessId',{name:$scope.name}).then(
      	function(response)
      	{
      		$scope.business_id = response.data._id;
      		console.log($scope.business_id);
      		Offers.get($scope.business_id).then(function(response) {
              $scope.offers = response.data;
        });
      	});

});


app.controller('createOffersController',function($scope,$http,Facilities,OneTimeEvent,status,$location,$routeParams)
{
          $scope.formData = {};
          $scope.user = {};
      		$scope.business_id = $routeParams.businessId;
          console.log($scope.business_id);
          status.local()
             .then(function(res){
               if(res.data){
                 $scope.user = res.data;
                 if(res.data.user_type == 1)
                   $scope.type = 1;
                 else if(res.data.user_type == 2 && res.data._id == $scope.business_id)
                 {
                  console.log($scope.business_id);
                   $scope.type  = 4;

                 }
                 else if(res.data.user_type == 3) $scope.type = 3;
               }
               else {
                 $scope.user = res.data._id;
                 status.foreign()
                 .then(function(res){
                   if(res.data.user_type)
                     $scope.type = 1;
                   else $scope.type = 2;
                 });
               }
             });



      Facilities.get($scope.business_id).then(function(response) {
              $scope.facilities = response.data;
              console.log("This business facilities :"+$scope.facilities);
        });
      OneTimeEvent.getOnceEvents($scope.business_id).then(function(response) {
              $scope.events = response.data;
              console.log("This business events :"+$scope.events);
        });

      $scope.today = new Date();
      $scope.error_message = "";
      $scope.createOffer = function()
      {
      	console.log($scope.formData);
      	 var fd = new FormData();
		  for(var key in $scope.formData)
		  {
		    console.log($scope.formData[key]);
		    if($scope.formData[key] != null)
		    fd.append(key, $scope.formData[key]);
		  }
		  console.log("image controller offer");
		  // if($scope.formData.facility_id == null) $scope.formData.facility_id = "";
		  // if($scope.formData.event_id == null) $scope.formData.event_id = "";

		 // console.log($scope.formData.facility_id);
		 // console.log($scope.formData.event_id);

      	$http.post('http://127.0.0.1:3000/offers/createOffer', fd,{
        transformRequest: angular.identity,
        headers: { 'Content-Type': undefined }
      }).then(function successCallback(response){
                      console.log(response.data);
                      $location.path('/business/'+ $scope.user.name);
                    }, function errorCallback(response){
                      console.log(response.data);
                      $scope.error_message = response.data;
                    });
      }


});

//========== Edit ============

app.controller('EditOffersController', function($scope, $http, $route,$location, Offers, $modal, $window,$routeParams) {

       // $scope.business_id = "58f0f3faaa02d151aa4c987c";
        $scope.name = $routeParams.name;
      $http.post('http://127.0.0.1:3000/business/getBusinessId',{name:$scope.name}).then(
      	function(response)
      	{
      		$scope.business_id = response.data._id;
      	});
      console.log("business in edit offer "+$scope.business_id);
      Offers.get($scope.business_id).then(function(response) {
              $scope.offers = response.data;
        });

	  $scope.editOffer = function (offerId,offerType) {
			$scope.message = "Show edit Form Button Clicked";
			console.log($scope.message);
			var modalInstance = $modal.open({
					templateUrl: 'views/editOffer.html',
					controller: 'EditOfferCtrl',
					scope: $scope,
					resolve: {
							offerId: function () {
								return offerId;
							}
							,
							offerType: function () {
								return offerType;
							}
					}
			});

			modalInstance.result.then(function (selectedItem) {
					$scope.selected = selectedItem;
					// $window.location.reload();
					$route.reload();
			});
	  };

});

app.controller('EditOfferCtrl',function($scope, $http, offerId,$location,offerType, $modalInstance, $route, Offers,$routeParams)
{
	$scope.offerType = offerType;
    $scope.submitForm = function (formData, facilityId) {
       		console.log(formData);
       		var fd = new FormData();
		  for(var key in formData)
		  {
		    console.log(formData[key]);
		    if(formData[key] != null)
		    fd.append(key, formData[key]);
		  }
		  console.log("image controller offer");



		 fd.append("id",offerId);
		 console.log(fd);

      	$http.post('http://127.0.0.1:3000/offers/updateOffer', fd,{
        transformRequest: angular.identity,
        headers: { 'Content-Type': undefined }
      }).then(function successCallback(response){
                      console.log(response.data);
                      // $location.path('/'+$scope.business_id);
                      $route.reload();
                    }, function errorCallback(response){
                      console.log(response.data);
                      $scope.error_message = response.data;
                    });

			// $http.post('http://127.0.0.1:3000/offers/updateOffer', {id:offerId, name:formData.name, value:formData.value , details:formData.details})
			// .then(function successCallback(response){
   //                    console.log(response.data);
   //                  }, function errorCallback(response){
   //                    console.log(response.data);
   //                  });

						$route.reload();
            $modalInstance.close('closed');
    };

    $scope.cancel = function () {
        $modalInstance.dismiss('cancel');
    };
});


// =========== Delete ============
app.controller('DeleteOffersController', function($scope, $http, $modal, $location, Offers,$routeParams) {

      $scope.business_id = $routeParams.id;
	  $scope.deleteOffer = function (offerId) {
				var modalInstance = $modal.open({
						templateUrl: 'views/deleteOffer.html',
						controller: 'DeleteOfferCtrl',
						scope: $scope,
						resolve: {
							offerId: function () {
									return offerId;
							}
					}
				});

				modalInstance.result.then(function (selectedItem) {
						$scope.selected = selectedItem;
				}, function () {
						$log.info('Modal dismissed at: ' + new Date());
				});
		};

});

app.controller('DeleteOfferCtrl',function($http, $scope, $modalInstance, offerId, $route,$routeParams){
	$scope.yes = function () {
            console.log("offerId to be deleted :"+offerId);
			$http.get('http://127.0.0.1:3000/offers/deleteOffer/'+offerId)
			.then(function successCallback(response){
                      console.log(response.data);
                    }, function errorCallback(response){
                      console.log(response.data);
                    });
						console.log("delete done");
						$route.reload();
            $modalInstance.close('closed');
    };

    $scope.no = function () {
        $modalInstance.dismiss('cancel');
    };
});
