var app = angular.module('fasa7ny');

app.controller('bookFacilityController', function ($scope, $http, $location, $routeParams, Offers, status, Occurrences, Global, Facilities) {
  $scope.business_id = $routeParams.id;
  $scope.user = {};
  status.local().then(function (res) {
    if (res.data) {
      $scope.user = res.data._id;
      if (res.data.user_type == 1)
        $scope.type = 1;
      else if (res.data.user_type == 2 && $scope.business_id == res.data._id)
        $scope.type = 4;
      else if (res.data.user_type == 3) $scope.type = 3;
    }
    else {
      $scope.user = res.data._id;
      status.foreign()
        .then(function (res) {
          if (res.data.user_type)
            $scope.type = 1;
          else $scope.type = 5;
        });
    }
  });

  console.log("in facility " + $scope.business_id);
  $scope.business_id = $routeParams.id;
  Facilities.get().then(function (response) {
    $scope.facilities = response.data;
  });
  Offers.get($scope.business_id).then(function (response) {
    $scope.offers = response.data;
    $scope.betengan = "Facility Booking";
  });
  Occurrences.get().then(function (response) {
    $scope.timings = response.data;
  });
  $scope.cash = true;
  // for (var i = $scope.business.payment_methods.length - 1; i >= 0; i--) {
  //   if($scope.business.payment_methods[i] === "cash")
  //     $scope.cash = true;
  // }

  $scope.choose_date = function (date) {
    $scope.date = date.getDate();
    $scope.year = date.getFullYear();
    $scope.month = date.getMonth();
  }
  $scope.Date = function (datetime) {
    return new Date(datetime).getDate();
  }
  $scope.Year = function (datetime) {
    return new Date(datetime).getFullYear();
  }
  $scope.Month = function (datetime) {
    return new Date(datetime).getMonth();
  }
  $scope.choose_occ = function (timing) {
    $scope.max_count = timing.available;
    $scope.event = timing.event;
    console.log("this is $scope.event in choose occ " + $scope.event);
    $scope.occ_id = timing._id;

    Facilities.getEvent($scope.event).then(function (response) {
      $scope.chosen_event = response.data;
      console.log("this is response.data in choose_occ " + response.data);
    });

  }

  console.log("chosen facility " + $scope.chosen_facility);

  $scope.minDate = new Date();
  var today = new Date();
  today.setMonth(today.getMonth() + 1);
  $scope.maxDate = new Date(today.getFullYear(), today.getMonth(), today.getDate());

  $scope.book_cash = function () {
    // console.log($scope.chosen_facility);
    // console.log($scope.formData.chosen_time.event);
    // console.log($scope.event);
    // console.log("This is scope.event: "+$scope.event);

    $scope.event_price = $scope.chosen_event.price;
    console.log("chosen eventprice in book cash is " + $scope.event_price);
    $scope.min_charge = apply_best_offer_facility($scope.chosen_facility, $scope.formData.chosen_time, $scope.event_price, $scope.chosen_event.capacity, $scope.formData.count, $scope.formData.chosen_offer, $scope.offers);
    $scope.error_message = "";
    console.log("This is count :" + $scope.formData.count);
    if ($scope.type == 1) {
      $http.post('http://127.0.0.1:3000/bookings/createRegUserBookings', { count: $scope.formData.count, event: $scope.occ_id, charge: $scope.min_charge, business_id: $scope.business_id })
        .then(function successCallback(response) {
          console.log(response.data);
          $location.path('/success/' + response.data._id);
        }, function errorCallback(response) {
          console.log(response.data);
          //redirect to not authorized page
          $scope.error_message = response.data;
        });
    }
    else if ($scope.type == 4) {
      $http.post('http://127.0.0.1:3000/bookings/book_event', { count: $scope.formData.count, event_id: $scope.occ_id, charge: $scope.min_charge })
        .then(function successCallback(responce) {
          console.log(responce.data);
          $location.path('/success/' + responce.data._id);

        }, function errorCallback(responce) {
          //redirect to not authorized page
          console.log(responce.data);
        });
    }

  }

  $scope.stripe_handler = StripeCheckout.configure({
    key: "pk_test_O1Gn3Rl11nLaHckNqvJOzaYz",
    locale: 'auto',
    currency: "egp",
    token: function (token) {
      console.log("token   " + token);
      console.log("token.id   " + token.id);
      $http.post('http://127.0.0.1:3000/bookings/charge', { stripeToken: token.id, amount: $scope.stripe_charge })
        .then(function successCallback(responce) {
          console.log("success  charge in responce  " + responce.data);
          console.log("success  charge in responce  " + responce.data.id);

          $http.post('http://127.0.0.1:3000/bookings/createRegUserBookings', { count: $scope.formData.count, event: $scope.occ_id, stripe_charge: responce.data.id, charge: $scope.charge, user_id: "58ed22fcbfe67363f0c3a41d", business_id: $scope.business_id })
            .then(function successCallback(responce) {
              console.log(responce.data);
              $location.path('/success/' + responce.data._id);

            }, function errorCallback(responce) {
              //redirect to not authorized page
              console.log(responce.data);
              $scope.error_message = responce.data;
            });

        }, function errorCallback(responce) {
          //redirect to not authorized page
          console.log(responce.data);
          $scope.error_message = responce.data;
        });
    }
  });
  $scope.open_stripe = function () {
    console.log($scope.chosen_facility);
    $scope.event_price = $scope.chosen_event.price;
    var basic_charge = apply_best_offer_facility($scope.facility, $scope.formData.chosen_time, $scope.event_price, $scope.chosen_event.capacity, $scope.formData.count, $scope.formData.chosen_offer, $scope.offers);
    var new_charge = basic_charge * 103;
    $scope.stripe_charge = Math.round(new_charge);
    $scope.charge = $scope.stripe_charge / 100;
    console.log("charge in stripe " + $scope.stripe_charge);
    $scope.stripe_handler.open({
      name: $scope.event.name,
      description: $scope.formData.count + " places",       // TODO add offer
      amount: $scope.stripe_charge
    });
  }

});


app.controller('successfulBookingController', function ($scope, $http, $location, $routeParams, status) {
  $scope.booking_id = $routeParams.bookingId;
  console.log("booking id in controller " + $scope.booking_id);
  $http.post('http://127.0.0.1:3000/bookings/get_booking', { bookingId: $scope.booking_id }).then(
    function (response) {
      $scope.booking = response.data;
      console.log(JSON.stringify($scope.booking));
    });
});

var apply_best_offer_facility = function (facility, event_occ, price, capacity, count, chosen_offer, offers) {
  var original_charge = price * count;
  console.log("price :" + price);
  console.log("count :" + count);

  console.log("original_charge " + original_charge);
  var min_charge = original_charge;
  if (typeof chosen_offer != 'undefined') {
    var newcharge = original_charge - ((chosen_offer / 100) * original_charge);
    min_charge = (min_charge > newcharge) ? newcharge : min_charge;
    // console.log("after chosen offer "+newcharge);
  }
  for (var i = offers.length - 1; i >= 0; i--) {
    if (typeof offers[i].event_id == 'undefined') {
      if (typeof offers[i].facility_id == 'undefined' || offers[i].facility_id === facility) {
        if (offers[i].type === "min_count" && count >= offers[i].count) {
          var newcharge = original_charge - ((offers[i].value / 100) * original_charge);
          min_charge = (min_charge > newcharge) ? newcharge : min_charge;
          // console.log("min_count   "+newcharge);
        }
        if (offers[i].type === "duration" && (new Date()).getTime() >= new Date(offers[i].start_date).getTime() && new Date(offers[i].expiration_date).getTime() > (new Date()).getTime()) {
          var newcharge = original_charge - ((offers[i].value / 100) * original_charge);
          min_charge = (min_charge > newcharge) ? newcharge : min_charge;
        }
        if (offers[i].type === "first_lucky" && (capacity - event_occ.available) < offers[i].lucky_first) {

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