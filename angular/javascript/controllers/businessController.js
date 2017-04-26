
var app = angular.module('fasa7ny');
app.controller('businessController', function ($scope, status, $http, Business, $location, Global, $routeParams, $modal, $log, $window, $document, Stats) {
$scope.type = 1; //must be initialized otherwise is undefined later 

  status.local()
    .then(function (res) {
      if (res.data) {
        if (res.data.user_type == 1)
          $scope.type = 1;
        else if (res.data.user_type == 2)
          $scope.type = 4;
        else $scope.type = 3;
      }
      else {
        status.foreign()
          .then(function (res) {
            if (res.data.user_type)
              $scope.type = 1;
            else $scope.type = 2;
          });
      }
    });


  // $scope.type = 2; //unregistered user or business visiting another business

  $scope.maxRating = 5;
  $scope.ratedBy = 0;
  $scope.avgRate = 0;
  $scope.sub = "Subscribe";

  // Global.setBusiness($routeParams.id); //make this by name


  $scope.imagelength = 0;
  $scope.business = {};
  $scope.slides = [];
  $scope.facilities = [];
  $scope.facilitylength = 0;
  $scope.phones = [];
  $scope.methods = [];

  $scope.events = []; //once events
  $scope.eventlength = 0;

  $scope.sublength = 0;
  $scope.offerslength = 0;
  Business.get($routeParams.name)
    .then(function (d) {
      console.log("then");
      status.local()
        .then(function (res) {
          if (res.data) {
            if (res.data.user_type == 1) {
              $scope.type = 1;
              if (d.data.rate) $scope.ratedBy = d.data.rate;

              console.log(res.data);
              console.log(d.data.result.subscribers);
              $scope.check = 0;
              for (var i = 0; i < d.data.result.subscribers.length; i++) {
                if (d.data.result.subscribers[i] == res.data._id) {
                  $scope.check = 1;
                  $scope.sub = "Unsubscribe";
                }
                console.log($scope.sub);
                console.log($scope.check);
              }
            }
            else if (res.data.user_type == 3) {
              $scope.type = 3;
            }
            else if (res.data.user_type == 2) {
              if (res.data._id == d.data.result._id) {
                $scope.type = 4;
              } else {
                $scope.type = 2;
              }
            } else $scope.type = 2;

          }
          else {
            status.foreign()
              .then(function (res) {
                if (res.data) {
                  if (res.data.user_type == 1) {
                    $scope.type = 1;
                    if (d.data.rate) $scope.ratedBy = d.data.rate;

                    $scope.check = 0;
                    for (var i = 0; i < d.data.result.subscribers.length; i++) {
                      if (d.data.result.subscribers[i] == res.data._id) {
                        $scope.check = 1;
                        $scope.sub = "Unsubscribe";
                      }
                    }
                  }
                  else if (res.data.user_type == 3) {
                    $scope.type = 3;
                  }
                  else if (res.data.user_type == 2) {
                    if (res.data._id === d.data.result.id) {
                      $scope.type = 4; //my business page
                    } else {
                      $scope.type = 2; //business visiting another business' page
                    }
                  } else $scope.type = 2;
                }
                else {
                  $scope.type = 2;
                }
              });
          }

        });

      console.log(d.data.result);
      $scope.business = d.data.result;

       //check cookies for page views count 
      Stats.checkCookies($scope.type, $scope.business._id); 
     

      $scope.phones = d.data.result.phones;
      $scope.phonelength = 0; //zero means that the business has more than one phone number
      if ($scope.phones.length == 1) $scope.phonelength = 1;

      $scope.sublength = $scope.business.subscribers.length;

      $scope.methods = d.data.result.payment_methods;
      $scope.paymentlength = $scope.methods.length; //zero means that the business has more than one payment method
      // if($scope.methods.length == 1) $scope.paymentlength = 1;
      console.log("PAYMENT METHODSSS");
      console.log($scope.methods);

      console.log($scope.paymentlength);
      $scope.categories = d.data.result.category;
      // $scope.user = d.data.user;
      // $scope.images = d.data.result.images;

      $scope.facilities = d.data.facilities;
      $scope.facilitylength = d.data.facilities.length;

      $scope.events = d.data.events; //once events
      $scope.eventlength = d.data.events.length;

      $scope.avgRate = d.data.result.average_rating;
      $scope.slides = $scope.business.images;
      $scope.imagelength = $scope.business.images.length;
      console.log("images: ", $scope.slides);
      // console.log($scope.check);
      // console.log($scope.sub);

      $scope.location = d.data.result.location;




    });


  $scope.initMap = function () {


    if ($scope.business.location) {
      var myLatLng2 = new google.maps.LatLng($scope.business.location.Lat, $scope.business.location.Lng);
      var mapProp2 =
        {
          center: myLatLng2,
          zoom: 5,
          mapTypeId: google.maps.MapTypeId.ROADMAP

        };

      var map2 = new google.maps.Map(document.getElementById("googleMap2"), mapProp2);


      var marker2 = new google.maps.Marker
        ({
          position: myLatLng2,
          map: map2,
          title: 'Location',
          draggable: false
        });



    }

  };

  google.maps.event.addDomListener(window, 'scroll', $scope.initMap);


  $scope.remove = function () {
    $scope.message = "Remove Button Clicked";
    console.log($scope.message);

    Business.hasBookings().then(function (responce) {
      if (responce.data != 0) {

        var notAllowedModalInstance = $modal.open({
          templateUrl: 'views/notAllowedRemovePop.html',
          controller: NotAllowedRemove,
          scope: $scope

        });

        modalInstance.result.then(function (selectedItem) {
          $scope.selected = selectedItem;
        });
      }
      else {

        var modalInstance = $modal.open({
          templateUrl: 'views/removePop.html',
          controller: Remove,
          scope: $scope

        });

        modalInstance.result.then(function (selectedItem) {
          $scope.selected = selectedItem;
        });
      }
    });

  };


  $scope.createOffer = function (id) {
    console.log("create offer controller");
    $location.path('/createOffer/' + id);
  };

  $scope.deleteImage = function (image) {
    $scope.message = "Show delete Form Button Clicked";
    console.log($scope.message);
    console.log(image);
    $scope.image = image;
    var modalInstance = $modal.open({
      templateUrl: 'views/deleteImage.html',
      controller: deleteImageCtrl,
      scope: $scope
    });

  }






  $scope.subscribe = function (id) {
    console.log("controller subscribe");
    Business.subscribe(id)
      .then(function (d) {
        console.log("sub done");
        $scope.sub = "Unsubscribe";
        $scope.check = 1;
        $scope.sublength = $scope.sublength + 1;
      })
  };

  $scope.unsubscribe = function (id) {
    console.log("controller unsubscribe");
    Business.unsubscribe(id)
      .then(function (d) {
        console.log("unsub done");
        $scope.sub = "Subscribe";
        $scope.check = 0;
        $scope.sublength = $scope.sublength - 1;
      })
  };

  $scope.rateBy = function (star, bid) {
    console.log(star + "!");
    Business.rate(star, bid)
      .then(function (d) {
        console.log("rating done");
        $scope.avgRate = d.data.average_rating;
        console.log($scope.avgRate);
        console.log(d.data.average_rating);
        $scope.ratedBy = star;
      });
  };


  $scope.public = function () {
    $scope.message = "Public Button Clicked";
    console.log($scope.message);
    var modalInstance = $modal.open({
      templateUrl: 'views/publicPop.html',
      controller: Public,
      scope: $scope

    });

    modalInstance.result.then(function (selectedItem) {
      $scope.selected = selectedItem;
      $scope.business.public = selectedItem.public;
    });
  };

  $scope.businessEdit = function () {
    console.log('businessedit ctrl');
    $location.path('/editBusiness');
  };

  $scope.businessEditLocation = function () {
    $location.path('/editLocation');
  };


  $scope.remove = function () {
    $scope.message = "Remove Button Clicked";
    console.log($scope.message);
    var modalInstance = $modal.open({
      templateUrl: 'views/removePop.html',
      controller: Remove,
      scope: $scope

    });



    modalInstance.result.then(function (selectedItem) {
      $scope.selected = selectedItem;
      $scope.business.delete = selectedItem.delete;
    });
  };

  $scope.bookFacility = function () {
    $scope.name = $routeParams.name;
    console.log("BOOK!!");
    $http.post('http://127.0.0.1:3000/business/getBusinessId', { name: $scope.name }).then(
      function (response) {
        console.log($scope.business_id);
        $scope.business_id = response.data._id;
        $location.path('/book_facility/' + $scope.business_id);
      });
  };

  $scope.getEvent = function (eventId) {
    console.log("get Event ctrl");
    $location.path('/eventPage/' + eventId);
  };

  $scope.createFacility = function (id) {
    console.log("create facility controller");
    $location.path('/createFacility/' + id);
  };

  $scope.deleteImage = function (image) {
    $scope.message = "Show delete Form Button Clicked";
    console.log($scope.message);
    console.log(image);
    $scope.image = image;
    var modalInstance = $modal.open({
      templateUrl: 'views/deleteImage.html',
      controller: deleteImageCtrl,
      scope: $scope
    });

    modalInstance.result.then(function (selectedItem) {
      $scope.selected = selectedItem;
      $scope.business = selectedItem.business;
      $scope.slides = $scope.business.images;
      $scope.imagelength = $scope.business.images.length;
    }, function () {
      $log.info('Modal dismissed at: ' + new Date());
    });
  };

  $scope.addImage = function () {
    $scope.message = "Show image Form Button Clicked";
    console.log($scope.message);
    var modalInstance = $modal.open({
      templateUrl: 'views/addImage.html',
      controller: addImageCtrl,
      scope: $scope
    });

    modalInstance.result.then(function (selectedItem) {
      $scope.selected = selectedItem;
      $scope.business = selectedItem.business;
      $scope.slides = $scope.business.images;
      console.log("NEWW" + $scope.slides);
      $scope.imagelength = $scope.business.images.length;

    }, function () {
      $log.info('Modal dismissed at: ' + new Date());
    });
  };

  $scope.deletePhone = function (phone) {
    $scope.message = "Show delete Form Button Clicked";
    console.log($scope.message);
    console.log(phone);
    $scope.phone = phone;
    var modalInstance = $modal.open({
      templateUrl: 'views/deletePhone.html',
      controller: deletePhoneCtrl,
      scope: $scope
    });

    modalInstance.result.then(function (selectedItem) {
      $scope.selected = selectedItem;
      $scope.phones = selectedItem.phones;
      $scope.phonelength = selectedItem.phones.length;
      console.log($scope.phones);
      console.log("ana henaaaa");
    }, function () {
      $log.info('Modal dismissed at: ' + new Date());
    });
  };

  $scope.deletePaymentMethod = function (method) {
    $scope.message = "Show delete Form Button Clicked";
    console.log($scope.message);
    console.log(method);
    $scope.method = method;
    var modalInstance = $modal.open({
      templateUrl: 'views/deletePaymentMethod.html',
      controller: deletePaymentMethodCtrl,
      scope: $scope
    });

    modalInstance.result.then(function (selectedItem) {
      $scope.selected = selectedItem;
      $scope.methods = selectedItem.methods;
      $scope.paymentlength = selectedItem.methods.length;
    }, function () {
      $log.info('Modal dismissed at: ' + new Date());
    });
  };

  $scope.createOneEvent = function (id) {
    console.log("create event controller" + id);
    $location.path('/createOneEvent/' + id);
  };

  $scope.schedule = function (name) {
    $location.path('/schedule/' + name);
  };

  $scope.changeImage = function () {
    $scope.error = "";
    console.log("changeImage controller");
    console.log($scope.formData);
    Business.changeImage($scope.formData)
      .then(function successCallback(d) {
        console.log("changeImage done");
        $route.reload();
      },
      function errorCallback(d) {
        $scope.error = d.data;
      });
  };

  $scope.viewStats = function() {
    $location.path('/statistics/' + $scope.business._id); 
  }

});


var Public = function ($scope, $modalInstance, Business, $route) {
  $scope.form = {}
  $scope.error = "";
  $scope.submitForm = function () {
    console.log('Public Form');
    Business.public()
      .then(function successCallback(d) {
        console.log('pub');
        $modalInstance.close({
          public: 1
        });
      },
      function errorCallback(d) {
        $scope.error = d.data;
      });

  };

  $scope.cancel = function () {
    $modalInstance.dismiss('cancel');
  };
};

var Remove = function ($scope, $modalInstance, Business, $route) {
  $scope.form = {}
  $scope.error = "";
  $scope.submitForm = function () {
    console.log('Remove Form');
    Business.remove()
      .then(function successCallback(d) {
        console.log('rem');
        $modalInstance.close({
          delete: 1
        });
      },
      function errorCallback(d) {
        $scope.error = d.data;
      });
  };
  $scope.cancel = function () {
    $modalInstance.dismiss('cancel');
  };
};


var NotAllowedRemove = function ($scope, $modalInstance, Business, $route) {
  $scope.form = {}
  $scope.submitForm = function () {
    $route.reload();
    $modalInstance.close('closed');
  };
};



var deleteImageCtrl = function ($scope, $modalInstance, Business, $route) {
  $scope.form = {};
  $scope.error = "";
  $scope.yes = function (image) {
    console.log('user form is in scope');
    console.log(image);
    Business.deleteImage(image)
      .then(function successCallback(d) {
        console.log(d.data.business);
        console.log('image business deleted!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!');
        $modalInstance.close({
          business: d.data.business
        });
      }, function errorCallback(d) {
        $scope.error = d.data;
      });
    // $location.path("/business/");
    // $route.reload();
    // console.log("????????????????????????????????");
  };

  $scope.no = function () {
    $modalInstance.dismiss('cancel');
  };
};

var addImageCtrl = function ($scope, $modalInstance, Business, $route) {
  $scope.error = "";
  $scope.addImage = function (formData) {
    console.log('add image is in scope');
    Business.addImage(formData)
      .then(function successCallback(d) {
        // $scope.business = business;
        // business = d.data.business;

        $modalInstance.close({
          business: d.data.business
        });
        // console.log(d.data.business);

      }, function errorCallback(d) {
        $scope.error = d.data;
      });
  };

  $scope.cancel = function () {
    $modalInstance.dismiss('cancel');
  };
};

var deletePhoneCtrl = function ($scope, $modalInstance, Business, $route) {

  $scope.error = "";
  $scope.yes = function (phone) {
    console.log('delete phone is in scope');
    Business.deletePhone(phone)
      .then(function successCallback(d) {
        console.log("done deleting phone!!!!!!!!!!!!!!!!!");
        console.log(d.data.business.phones);
        $modalInstance.close({
          phones: d.data.business.phones
        });
      },
      function errorCallback(d) {
        $scope.error = d.data;
      });

  };

  $scope.no = function () {
    $modalInstance.dismiss('cancel');
  };
};

var deletePaymentMethodCtrl = function ($scope, $modalInstance, business, Business, $route) {
  $scope.error = "";
  $scope.yes = function (method) {
    console.log('delete payment method is in scope');
    Business.deletePaymentMethod(method)
      .then(function successCallback(d) {
        $scope.business = business;
        $scope.business = d.data.business;
        console.log("done deleting payment_method");
        $modalInstance.close({
          methods: d.data.business.payment_methods
        });
      },
      function errorCallback(d) {
        $scope.error = d.data;
      });
  };
  $scope.no = function () {
    $modalInstance.dismiss('cancel');
  };

  //check if user is logged in




}
