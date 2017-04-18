var app = angular.module('fasa7ny');

app.controller('bookFacilityController', function($scope, $http, $location, Offers,Occurrences,Facilities) {
      
      Offers.get("58f0f3faaa02d151aa4c987c").then(function(response) {
              $scope.offers = response.data;
              $scope.betengan = "Facility Booking";
        });
      Facilities.get().then(function(response){
           $scope.facilities = response.data;
      });
      Occurrences.get().then(function(response){
           $scope.timings = response.data;
      });
      $scope.chosen_event = "Batta";
      $scope.cash = true;
        // for (var i = $scope.business.payment_methods.length - 1; i >= 0; i--) {
        //   if($scope.business.payment_methods[i] === "cash")
        //     $scope.cash = true;
        // }
        
      $scope.choose_facility = function(facility_id)
      {
        $scope.facility = facility_id;
      }
      $scope.choose_date = function(date)
      {
        $scope.date  = date.getDate();
        $scope.year  = date.getFullYear();
        $scope.month = date.getMonth();
      }
      $scope.Date = function(datetime)
      {
        return new Date(datetime).getDate();
      }
      $scope.Year = function(datetime)
      {
        return new Date(datetime).getFullYear();
      }
      $scope.Month = function(datetime)
      {
        return new Date(datetime).getMonth();
      }
      $scope.choose_occ = function(timing)
      {
        $scope.max_count = timing.available;
        $scope.event = timing.event;
        console.log("this is $scope.event in choose occ "+$scope.event);
        $scope.occ_id = timing._id;

        Facilities.getEvent($scope.event).then(function(response)
        {
            $scope.chosen_event = response.data;
            console.log("this is response.data in choose_occ "+response.date);
        });
      }

      $scope.minDate = new Date();
      var today = new Date();
      today.setMonth(today.getMonth()+1);
      $scope.maxDate = new Date(today.getFullYear(),today.getMonth() , today.getDate());

      $scope.book_cash = function()
      {
        console.log($scope.chosen_facility);
        
        console.log($scope.formData.chosen_time);
        console.log($scope.formData.chosen_time.event);
        console.log($scope.event);
        console.log("This is scope.event: "+$scope.event);

        $scope.event_price = $scope.chosen_event.price;
        console.log("chosen eventprice in book cash is "+$scope.event_price);
        $scope.min_charge = apply_best_offer_facility($scope.facility, $scope.formData.chosen_time, $scope.event_price, $scope.chosen_event.capacity, $scope.formData.count, $scope.formData.chosen_offer, $scope.offers);
        
        
         console.log("This is count :"+ $scope.formData.count);
  
         $http.post('http://127.0.0.1:3000/bookings/createRegUserBookings', {count: $scope.formData.count ,event: $scope.occ_id, charge: $scope.charge, user_id: "58f0f48daa02d151aa4c987f"})
                    .then(function successCallback(response){
                      console.log(response.data);
                    }, function errorCallback(response){
                      console.log(response.data);
                    }); 
                    
      }

      $scope.stripe_handler = StripeCheckout.configure({
          key: "pk_test_O1Gn3Rl11nLaHckNqvJOzaYz",
          locale: 'auto',
          currency : "egp",
          token: function(token) 
          {
            console.log("token   "+ token);
            console.log("token.id   "+ token.id);
            $http.post('http://127.0.0.1:3000/bookings/charge', {stripeToken: token.id, amount: $scope.stripe_charge})
                    .then(function successCallback(responce){
                      console.log("success  charge in responce  "+ responce.data);
                      console.log("success  charge in responce  "+ responce.data.id);
                      $http.post('http://127.0.0.1:3000/bookings/createRegUserBookings', {count: $scope.formData.count ,event: $scope.occ_id, stripe_charge:responce.data.id, charge: $scope.min_charge, user_id: "58f0f48daa02d151aa4c987f"})
                            .then(function successCallback(responce){
                              console.log(responce.data);
                            }, function errorCallback(responce){
                              console.log(responce.data);
                            }); 

                    }, function errorCallback(responce){
                      console.log(responce.data);
                    });
          }
        });
        $scope.open_stripe = function()
        {
          console.log($scope.chosen_facility);
          $scope.event_price = $scope.chosen_event.price;          
          var basic_charge = apply_best_offer_facility($scope.facility, $scope.formData.chosen_time, $scope.event_price, $scope.chosen_event.capacity, $scope.formData.count, $scope.formData.chosen_offer, $scope.offers);
          var new_charge = basic_charge * 103;
          $scope.stripe_charge = Math.round(new_charge);
          $scope.charge  = $scope.stripe_charge / 100; 
          console.log("charge in stripe " + $scope.stripe_charge);
          $scope.stripe_handler.open({
            name: $scope.event.name,
            description: $scope.formData.count + " places",       // TODO add offer
            amount: $scope.stripe_charge
          });
        }  

});

var apply_best_offer_facility = function(facility, event_occ, price, capacity, count, chosen_offer, offers)
{
                var original_charge = price * count;
                console.log("price :"+price );
                console.log("count :"+count );

                console.log("original_charge "+original_charge);
                var min_charge = original_charge;
                if(typeof chosen_offer != 'undefined')
                {
                    var newcharge = original_charge -  ((chosen_offer / 100) * original_charge);
                    min_charge = (min_charge > newcharge) ? newcharge : min_charge;
                    // console.log("after chosen offer "+newcharge);
                }
                for (var i = offers.length - 1; i >= 0; i--)
                {
                    if(typeof offers[i].event_id == 'undefined')
                    {
                        if(typeof offers[i].facility_id == 'undefined' || offers[i].facility_id === facility._id)
                        {
                            if(offers[i].type === "min_count" && count >= offers[i].count)
                            {
                                var newcharge = original_charge -  ((offers[i].value / 100) * original_charge);
                                min_charge = (min_charge > newcharge) ? newcharge : min_charge;
                                // console.log("min_count   "+newcharge);  
                            }
                            if(offers[i].type === "Duration" && Date.now().$gt(offers[i].start_date) && offers[i].expiration_date.$gt(Date.now()))
                            {
                                var newcharge = original_charge -  ((offers[i].value / 100) * original_charge);
                                min_charge = (min_charge > newcharge) ? newcharge : min_charge;     
                            }
                            if(offers[i].type === "first_lucky" && (capacity - event_occ.available) < offers[i].lucky_first)
                            {

                                var lucky = offers[i].lucky_first - (capacity - event_occ.available);
                                var apply_on = (lucky < count) ? lucky : count;
                                var newcharge = ((apply_on * event.price) - offers[i].value / 100 * apply_on * event.price) + (count - apply_on) * event.price;
                                min_charge = (min_charge > newcharge) ? newcharge : min_charge; 
                                // console.log("first lucky  "+ newcharge); 
                            }
                        }
                    }
                }
                return min_charge;
}
                        
     