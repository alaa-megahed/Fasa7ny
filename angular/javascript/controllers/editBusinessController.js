app.controller('editBusinessController', function($scope, status,$http, Business, $location, $routeParams, $modal, $log) {

  console.log("EDIT BUSINESS CONTROLLER");
  $scope.user = {};
  $scope.cash = 0;
  $scope.stripe = 0;
  $scope.both = 0;
		status.local()
		 .then(function(res){
		   if(res.data){
				 $scope.user = res.data;
         console.log( $scope.user.payment_methods);
         for(var i = 0; i < $scope.user.payment_methods.length; i++)
          {
            if($scope.user.payment_methods[i] === "Cash") $scope.cash = 1;
            if($scope.user.payment_methods[i] === "Stripe") $scope.stripe = 1;
            if($scope.cash && $scope.stripe) $scope.both = 1;
          }
          console.log($scope.cash);
          console.log($scope.stripe);
		     if(res.data.user_type == 1)
		       $scope.type = 1;
		     else if(res.data.user_type == 2)
		       $scope.type  = 4;
		     else $scope.type = 3;
		   }
		   else {
				 $scope.user = res.data;
		     status.foreign()
		     .then(function(res){
		       if(res.data.user_type)
		         $scope.type = 1;
		       else $scope.type = 2;
		     });
		   }
		});

    $scope.formData = {};

  $scope.goToEdit = function() {
  $scope.error = "";
  console.log("controller"+ $scope.formData);
  var payment = [];
  var i = 0;
  if($scope.formData.pay0 == true){
    payment[i] =  "Cash";
    i++;
  }
   if($scope.formData.pay1 == true) payment[i] =  "Stripe";

   $scope.formData.payment_methods = payment;

    Business.edit($scope.formData)
    .then(function successCallback(d) {
      console.log("!!!!!!!!!!!!!!!!DATTAAA!!!!!!!!!!!!!!!!!!!");
      console.log(d.data);
      console.log(d.data.business.name);
      $location.path('/business/'+ d.data.business.name);
    },function errorCallback(d){
      $scope.error = d.data;
    })
  };

});
