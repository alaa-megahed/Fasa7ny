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




    $scope.initMap = function () {


      $scope.Lat =  $scope.business.location ? $scope.business.location.Lat : 30.05483;
      $scope.Lng =  $scope.business.location ? $scope.business.location.Lng : 31.23413;


        var myLatlng = new google.maps.LatLng($scope.Lat, $scope.Lng);
        var mapProp = {
        center:myLatlng,
        zoom:5,
        mapTypeId:google.maps.MapTypeId.ROADMAP

      };

      var map=new google.maps.Map(document.getElementById("googleMap"), mapProp);

      var marker = new google.maps.Marker({
          position: myLatlng,
          map: map,
          title: 'Hello World!',
          draggable:true
      });


     // marker drag event
     google.maps.event.addListener(marker,'drag',function(event) {
       $scope.Lat = event.latLng.lat();
       $scope.Lng = event.latLng.lng();

     });
   //  marker drag event end
     google.maps.event.addListener(marker,'dragend',function(event) {
     $scope.Lat = event.latLng.lat();
     $scope.Lng = event.latLng.lng();
     console.log("EVENT " + event.latLng.lat() + " " + event.latLng.lng());
     console.log("In the controller changing with gmaps: " + $scope.Lat  + " " + $scope.Lng);
     });





    }

    google.maps.event.addDomListener(window, 'scroll', $scope.initMap);





















});
