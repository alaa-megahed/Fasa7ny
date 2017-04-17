
var app = angular.module('fasa7ny');
app.controller('bookingController', function($scope, $http, $location, Offers) {
        $scope.business_id = "58f0cb2d6bfb6061efd66625";
        $scope.event = {
                "_id" : "58f39c7850010178595ccfef",
                "location" : "costa",
                "name" : "RAN",
                "description" : "ran",
                "price" : "0.36",
                "capacity" : 4,
                "repeated" : "Once",
                "business_id" : "58f0cb2d6bfb6061efd66625",
                "daysOff" : [
                  "5"
                ],
                "image" : [
                  " "
                ],
                "__v" : 0
              };
        $scope.event_occ =  {
              "_id" : "58f39c7850010178595ccff0",
              "day" : null,
              "time" : "",
              "available" : 4,
              "event" : "58f39c7850010178595ccfef",
              "bookings" : [ ],
              "__v" : 0
            };
        $scope.user =  {
              "_id" : ObjectId("58ed22fcbfe67363f0c3a41d"),
              "gender" : "female",
              "address" : "",
              "birthdate" : ISODate("1997-03-30T00:00:00Z"),
              "phone" : "",
              "email" : "alaamegahed12@gmail.com",
              "name" : "Alaa",
              "subscriptions" : [ ],
              "bookings" : [
                ObjectId("58f0cc67081e5b62141b646d"),
                ObjectId("58f0deeb6d170068eafec362"),
                ObjectId("58f0e129de29ae69f213bd64"),
                ObjectId("58f0e33c4f07bd6bca56541c"),
                ObjectId("58f0e52c8b33b06ca02ef81a"),
                ObjectId("58f0e6b1f134b16da839ef21")
              ],
              "user_type" : 1,
              "local" : {
                "password" : "$2a$08$HeRTDO19GFgNG.BQjbxkyugPf6wLzsS6jlJULH.lIS2bTOk2NlRPq",
                "username" : "alaa"
              },
              "__v" : 8,
              "notifications" : [
                ObjectId("58f0e5798b33b06ca02ef81b"),
                ObjectId("58f0e6d9f134b16da839ef22")
              ]
            };
   
            $scope.cash = false;
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

        $scope.book_stripe = function()
        {		
          var chosen_offer = $scope.formData.chosen_offer;
        	console.log("count   "+$scope.formData.count+" offer   "+$scope.formData.chosen_offer); //why  undefined?
          var min_charge = apply_best_offer($scope.event, $scope.event_occ, $scope.formData.count, $scope.formData.chosen_offer, offers);
            // .then(function(response){
                $scope.charge = min_charge;
                console.log("charge   " + min_charge); 
            // });

            // $http.post('http://127.0.0.1:3000/bookings/createRegUserBookings/', {count: $scope.formData.count ,event: $scope.event_occ._id, cahrge: min_charge})
            //         .then(function successCallback(responce){
            //           console.log(responce.data);
            //         }, function errorCallback(responce){
            //           console.log(responce.data);
            //         });                                  
         
        }

        $scope.book_cash = function()
        {   
          var chosen_offer = $scope.formData.chosen_offer;
          console.log("count   "+$scope.formData.count+" offer   "+$scope.formData.chosen_offer); //why  undefined?
          var min_charge = apply_best_offer($scope.event, $scope.event_occ, $scope.formData.count, $scope.formData.chosen_offer, offers);
            // .then(function(response){
                $scope.charge = min_charge;
                console.log("charge   " + min_charge); 
            // });
          $http.post('http://127.0.0.1:3000/bookings/createRegUserBookings/', {count: $scope.formData.count ,event: $scope.event_occ._id, cahrge: min_charge})
                    .then(function successCallback(responce){
                      console.log(responce.data);
                    }, function errorCallback(responce){
                      console.log(responce.data);
                    }); 
        }

        var apply_best_offer = function(event, event_occ, count, chosen_offer, offers)
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
                return min_charge;
            }
                        
     });


app.controller('bookFacilityController', function($scope, $http, $location, Offers,Occurrences,Facilities) {
      

      Offers.get().then(function(response) {
              $scope.offers = response.data;
              $scope.betengan = "Facility Booking";
        });
      Facilities.get().then(function(response){
           $scope.facilities = response.data;
           console.log("facilities response :"+response);
      });
      Occurrences.get().then(function(response){
           $scope.timings = response.data;
      });

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
        console.log(timing.available);
      }

      $scope.minDate = new Date();
      var today = new Date();
      today.setMonth(today.getMonth()+1);
      $scope.maxDate = new Date(today.getFullYear(),today.getMonth() , today.getDate());

      $scope.book = function()
      {
          $http.post('/bookings/regusers',{count: $scope.formData.count,offer_id:$scope.formData.chosen_offer,
                                            event:$scope.formData.chosen_time.id}).then(function(data)
          {
            console.log(data);
          });
      }

      
       
});


