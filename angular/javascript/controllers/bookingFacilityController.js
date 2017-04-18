var app = angular.module('fasa7ny');

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
        

         console.log("This is count :"+ $scope.formData.count);

         $http.post('http://127.0.0.1:3000/bookings/charge',{amount: $scope.min_charge}) //need to pass token
              .then(function successCallback(response){
                    $http.post('http://127.0.0.1:3000/bookings/createRegUserBookings', {count: $scope.formData.count ,event: $scope.occ_id, stripe_charge:response.data, charge: $scope.min_charge, user_id: "58f0f48daa02d151aa4c987f"})
                    .then(function successCallback(response){
                      console.log(response.data);
                    }, function errorCallback(response){
                      console.log(response.data);
                    }); 
                    }, function errorCallback(response){
                      console.log(response.data);
                    });  
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
                        
     



