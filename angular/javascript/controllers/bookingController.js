
var app = angular.module('fasa7ny');
app.controller('bookingController', function($scope, $http, $location, Offers) {
        $scope.business_id = "58f0f3faaa02d151aa4c987c";
        $scope.event = {
        "_id" : "58f1605e08902a21866c2c97",
        "location" : "lo",
        "name" : "New event",
        "description" : "desc",
        "price" : "0.01",
        "capacity" : 5,
        "repeated" : "Once",
        "business_id" : "58f0f3faaa02d151aa4c987c",
        "daysOff" : [ ],
        "image" : [
          " "
        ],
        "__v" : 0
      };
        $scope.event_occ =  {
        "_id" : "58f4956e8840b8799d139698",
        "day" : "2017-04-17T10:14:06.143Z",
        "time" : "4-5",
        "available" : 7,
        "event" : "58f1605e08902a21866c2c97",
        "facility_id" :"58f3bddb232f9d42f7d3a3a3",
        "bookings" : [ ],
        "__v" : 0
      };
        $scope.user =  {

          "_id" : "58f0f48daa02d151aa4c987f",
          "name" : "Nourhan Khaled",
          "user_type" : 1,
          "google" : {
            "email" : "nourhan.kh02@gmail.com",
            "token" : "ya29.GlstBLag8DFxjWiCAcXAheP_6gH5nXKdBrFWfmb3z6VVzz-5vq9TzVm3o7RR63o3N2F28tDe8oQoKfdUbuXD2CL7XJxwV32JFhdjrFeFgjH3hY4aLSc0wKDS6rm7",
            "id" : "105938228902529994494"
          },
          "unread_notifications" : 5,
          "notifications" : [
            "Nourhan cancelled NAR     1492186549825",
            "Nourhan added aywa ba2a        1492187328117",
            "Nourhan added testing notifications    1492211858292",
            "Nourhan added new date    1492211996137",
            "Nourhan added please yala    20170414",
            "Nourhan added yemken    20170414",
            "Nourhan added try unread    20170414",
            "Nourhan added New event        1492213854486",
            "Nourhan added name    20170417",
            "Nourhan added ya rab    20170417",
            "Nourhan added ana shaghal    20170417"
          ],
          "subscriptions" : [
            "58f0f3faaa02d151aa4c987c"
          ],
          "bookings" : [
            "58f0f584aa02d151aa4c9881"
          ],
          "__v" : 2
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

        $scope.book_stripe = function()
        {		
          var chosen_offer = $scope.formData.chosen_offer;
        	console.log("count   "+$scope.formData.count+" offer   "+$scope.formData.chosen_offer); //why  undefined?
          var min_charge = apply_best_offer_once_event($scope.event, $scope.event_occ, $scope.formData.count, $scope.formData.chosen_offer, offers);
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
          var min_charge = apply_best_offer_once_event($scope.event, $scope.event_occ, $scope.formData.count, $scope.formData.chosen_offer, offers);
            // .then(function(response){
                $scope.charge = min_charge;
                console.log("charge   " + min_charge); 
            // });

          $http.post('http://127.0.0.1:3000/bookings/createRegUserBookings', {count: $scope.formData.count ,event: $scope.event_occ._id, charge: min_charge, user_id: $scope.user._id})
                    .then(function successCallback(responce){
                      console.log(responce.data);
                    }, function errorCallback(responce){
                      console.log(responce.data);
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
                return min_charge;
            }
                        
     });
var apply_best_offer_facility = function(facility, event_occ, price, capacity, count, chosen_offer, offers)
        {
                var original_charge = price * count;
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
                        
     

app.controller('bookFacilityController', function($scope, $http, $location, Offers,Occurrences,Facilities) {
      

      Offers.get("58f0f3faaa02d151aa4c987c").then(function(response) {
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
        $scope.event = timing.event;
        $scope.occ_id = timing._id;
      }


      $scope.minDate = new Date();
      var today = new Date();
      today.setMonth(today.getMonth()+1);
      $scope.maxDate = new Date(today.getFullYear(),today.getMonth() , today.getDate());

      $scope.book = function()
      {
        console.log($scope.chosen_facility);
        $scope.chosen_event = Facilities.getEvent($scope.event);
        console.log($scope.formData.chosen_time);
        console.log($scope.formData.chosen_time.event);
        console.log($scope.event);

        $scope.event_price = $scope.chosen_event.price;
        $scope.min_charge = apply_best_offer_facility($scope.facility, $scope.formData.chosen_time, $scope.event_price, $scope.chosen_event.capacity, $scope.formData.count, $scope.formData.chosen_offer, $scope.offers);
          // $http.post('/bookings/createRegUserBookings',{count: $scope.formData.count,offer_id:$scope.formData.chosen_offer,
          //                                   event:$scope.formData.chosen_time.id}).then(function(data)
          // {
          //   console.log(data);
          // });

          console.log("This is count :"+ $scope.formData.count);

          $http.post('http://127.0.0.1:3000/bookings/createRegUserBookings', {count: $scope.formData.count ,event: $scope.occ_id, charge: $scope.min_charge, user_id: "58f0f48daa02d151aa4c987f"})
                    .then(function successCallback(response){
                      console.log(response.data);
                    }, function errorCallback(response){
                      console.log(response.data);
                    });                                     


      }

      
       
});


