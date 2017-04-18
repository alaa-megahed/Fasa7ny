
var app = angular.module('fasa7ny');
app.controller('bookingEventController', function($scope, $http, $location, Offers) 
{
        $scope.business_id = "58f0f3faaa02d151aa4c987c";
        $scope.event = {
            "_id" : ("58f39c7850010178595ccfef"),
            "location" : "costa",
            "name" : "RAN",
            "description" : "ran",
            "price" : "0.36",
            "capacity" : 4,
            "repeated" : "Once",
            "business_id" : ("58f0cb2d6bfb6061efd66625"),
          };
        $scope.event_occ =  {
            "_id" : ("58f39c7850010178595ccff0"),
            "available" : 4,
            "event" : ("58f39c7850010178595ccfef"),
          };
        $scope.user =  {

              "_id" : ("58ed22fcbfe67363f0c3a41d"),
              "gender" : "female",
              "address" : "",
              // "birthdate" : ISODate("1997-03-30T00:00:00Z"),
              "phone" : "",
              "email" : "alaamegahed12@gmail.com",
              "name" : "Alaa",
              "subscriptions" : [ ],
              "user_type" : 1,
              "local" : {
                "password" : "$2a$08$HeRTDO19GFgNG.BQjbxkyugPf6wLzsS6jlJULH.lIS2bTOk2NlRPq",
                "username" : "alaa"
              },
              "__v" : 8,
            };
   
            $scope.cash = true;
        // for (var i = $scope.business.payment_methods.length - 1; i >= 0; i--) {
        //   if($scope.business.payment_methods[i] === "cash")
        //     $scope.cash = true;
        // }
        $scope.min = 1;
        $scope.max = $scope.event_occ.available;
        var offers;
        Offers.get($scope.business_id)
                .then(function(response) {
                       offers = response.data;
                       $scope.offers = response.data;
                       $scope.betengan = "Roody";
                   });

        $scope.book_cash = function()
        {   
          var chosen_offer = $scope.formData.chosen_offer;
          console.log("count   "+$scope.formData.count+" offer   "+$scope.formData.chosen_offer); //why  undefined?
          var min_charge = apply_best_offer_once_event($scope.event, $scope.event_occ, $scope.formData.count, $scope.formData.chosen_offer, offers);
          $scope.charge = min_charge;
          console.log("charge   " + min_charge); 
          $http.post('http://127.0.0.1:3000/bookings/createRegUserBookings', {count: $scope.formData.count ,event: $scope.event_occ._id, charge: min_charge, user_id: $scope.user._id})
                    .then(function successCallback(responce){
                      console.log(responce.data);
                    }, function errorCallback(responce){
                      console.log(responce.data);
                    }); 
        }        

        Offers.getPublishKey().then(function(responce){
          console.log("PK  "+responce.data);
          $scope.publish_key = responce.data;
        });
        
        $scope.stripe_handler = StripeCheckout.configure({
          key: "pk_test_O1Gn3Rl11nLaHckNqvJOzaYz",
          locale: 'auto',
          currency : "egp",
          token: function(token) 
          {
            console.log("token   "+ token);
            console.log("token.id   "+ token.id);
            $http.post('http://127.0.0.1:3000/bookings/charge', {stripeToken: token, amount: $scope.stripe_charge})
                    .then(function successCallback(responce){
                      console.log("success  charge in responce  "+ responce.data);
                      $http.post('http://127.0.0.1:3000/bookings/createRegUserBookings/', {count: $scope.formData.count ,event: $scope.event_occ._id, charge: $scope.stripe_charge, charge_id: responce.data.id})
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
          var basic_charge = apply_best_offer_once_event($scope.event, $scope.event_occ, $scope.formData.count, $scope.formData.chosen_offer, offers);
          var new_charge = basic_charge * 103;
          $scope.stripe_charge = Math.round(new_charge); 
          console.log("charge in stripe " + $scope.stripe_charge);
          $scope.stripe_handler.open({
            name: $scope.event.name,
            description: $scope.formData.count + " places",
            amount: $scope.stripe_charge
          });
        }

        var apply_best_offer_once_event = function(event, event_occ, count, chosen_offer, offers)
        {
                var original_charge = event.price * count;
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
                    if(typeof offers[i].facility_id == 'undefined')
                    {
                        if(typeof offers[i].event_id == 'undefined' || offers[i].event_id === event._id)
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
                            if(offers[i].type === "first_lucky" && (event.capacity - event_occ.available) < offers[i].lucky_first)
                            {

                                var lucky = offers[i].lucky_first - (event.capacity - event_occ.available);
                                var apply_on = (lucky < count) ? lucky : count;
                                var newcharge = ((apply_on * event.price) - offers[i].value / 100 * apply_on * event.price) + (count - apply_on) * event.price;
                                min_charge = (min_charge > newcharge) ? newcharge : min_charge; 
                                // console.log("first lucky  "+ newcharge); 
                            }
                        }
                    }
                }
                min_charge = min_charge.toFixed(2);
                console.log("min_charge  "+ min_charge);
                return min_charge;
        }
                        
});
