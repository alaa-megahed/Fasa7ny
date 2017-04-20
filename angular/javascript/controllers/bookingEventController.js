
var app = angular.module('fasa7ny');

app.controller('bookingEventController', function($scope, $http, $location, Offers) 
{
        $scope.business_id = "58f0cb2d6bfb6061efd66625";
        $scope.current_user = "";
        $scope.current_business = "";


      //   $scope.event = 
      //   {
      //   "_id" : "58f15ed24452f7209873d9ce",
      //   "location" : "loc",
      //   "name" : "Testing unread",
      //   "description" : "You see, but you do not observe, the distinction is clear.",
      //   "price" : "101",
      //   "capacity" : 3,
      //   "repeated" : "Once",
      //   "business_id" : "58f0f3faaa02d151aa4c987c",
      //   "daysOff" : [ ],
      //   "image" : [
      //     " "
      //   ],
      //   "__v" : 0
      // };
      //   $scope.event_occ =  {
      //   "_id" : "58f15ed24452f7209873d9cf",
      //   "day" : null,
      //   "time" : "",
      //   "available" : 3,
      //   "event" : "58f15ed24452f7209873d9ce",
      //   "bookings" : [ ],
      //   "__v" : 0
      // };
      //   $scope.user = {
      //   "_id" : "58f0f48daa02d151aa4c987f",
      //   "name" : "Nourhan Khaled",
      //   "user_type" : 1,
      //   "google" : {
      //     "email" : "nourhan.kh02@gmail.com",
      //     "token" : "ya29.GlstBLag8DFxjWiCAcXAheP_6gH5nXKdBrFWfmb3z6VVzz-5vq9TzVm3o7RR63o3N2F28tDe8oQoKfdUbuXD2CL7XJxwV32JFhdjrFeFgjH3hY4aLSc0wKDS6rm7",
      //     "id" : "105938228902529994494"
      // },
      // "unread_notifications" : 5,
      // "notifications" : [
      //   "Nourhan cancelled NAR     1492186549825",
      //   "Nourhan added aywa ba2a        1492187328117",
      //   "Nourhan added testing notifications    1492211858292",
      //   "Nourhan added new date    1492211996137",
      //   "Nourhan added please yala    20170414",
      //   "Nourhan added yemken    20170414",
      //   "Nourhan added try unread    20170414",
      //   "Nourhan added New event        1492213854486",
      //   "Nourhan added name    20170417",
      //   "Nourhan added ya rab    20170417",
      //   "Nourhan added ana shaghal    20170417"
      // ],
      // "subscriptions" : [
      //   "58f0f3faaa02d151aa4c987c"
      // ],
      // "bookings" : [
      //   "58f0f584aa02d151aa4c9881",
      //   "58f50d0f02e15549cdd9bea5",
      //   "58f52adeaea3165b27179f0b",
      //   "58f62f4bb2ba0c26d6622b98",
      //   "58f630dbb2ba0c26d6622b99",
      //   "58f6347ec5de562864ae76e6",
      //   "58f63812a44c6629f464af99",
      //   "58f638d266181d2a97087a2f"
      // ],
      // "__v" : 9
      // };
        $scope.event = {
          "_id" : ("58f39c7850010178595ccfef"),
          "location" : "costa",
          "name" : "RAN",
          "description" : "ran",
          "price" : 100,
          "capacity" : 4,
          "repeated" : "Once",
          "business_id" : ("58f0cb2d6bfb6061efd66625"),
          "daysOff" : [
            "5"
          ],
          "image" : [
            " "
          ],
          "__v" : 0
        };
        
        $scope.event_occ =  {
          "_id" : ("58f39c7850010178595ccff0"),
          "day" : null,
          "time" : "",
          "available" : 1,
          "event" : ("58f39c7850010178595ccfef"),
          "availble" : 5
        };
        
        $scope.user = {
      
  "_id" : ("58ed22fcbfe67363f0c3a41d"),
  "gender" : "female",
  "address" : "",
  "birthdate" : ("1997-03-30T00:00:00Z"),
  "phone" : "",
  "email" : "alaamegahed12@gmail.com",
  "name" : "Alaa",
  "user_type" : 1,
  "local" : {
    "password" : "$2a$08$HeRTDO19GFgNG.BQjbxkyugPf6wLzsS6jlJULH.lIS2bTOk2NlRPq",
    "username" : "alaa"
  },
 
};
// >>>>>>> 62c263a62d53cc6f742021b5718ec747716b4590
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

          //if($scope.current_user)
          $http.post('http://127.0.0.1:3000/bookings/createRegUserBookings', {count: $scope.formData.count ,event: $scope.event_occ._id, charge: $scope.charge, user_id: $scope.user._id, business_id: $scope.business_id})
                    .then(function successCallback(responce){
                      console.log(responce.data);
                    }, function errorCallback(responce){
                      console.log(responce.data);
                    }); 

          //else if($scope.current_business)
          // {
             // $http.post('http://127.0.0.1:3000/bookings/book_event', {count: $scope.formData.count ,event: $scope.event_occ._id, charge: $scope.charge, user_id: $scope.user._id})
             //        .then(function successCallback(responce){
             //          console.log(responce.data);
             //        }, function errorCallback(responce){
             //          console.log(responce.data);
             //        }); 
          // }
        }        
        
        $scope.stripe_handler = StripeCheckout.configure(
        {
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
                      $http.post('http://127.0.0.1:3000/bookings/createRegUserBookings/', {count: $scope.formData.count ,event: $scope.event_occ._id, charge: $scope.charge, stripe_charge: responce.data.id, user_id: $scope.user._id, business_id: $scope.business_id})
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
          $scope.charge  = $scope.stripe_charge / 100; 
          console.log("charge in stripe " + $scope.stripe_charge);
          $scope.stripe_handler.open({
            name: $scope.event.name,
            description: $scope.formData.count + " places",       // TODO add offer
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
