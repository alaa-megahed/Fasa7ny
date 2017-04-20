// angular.module('businessService', [])

app.factory('Business', ['$http', function ($http) {
  return {
    get: function (id) {
      return $http.get('http://127.0.0.1:3000/business/b/' + id, { withCredentials: true });
    },

    edit: function (formData) {
      console.log("service!");
      return $http.post('http://127.0.0.1:3000/business/editInformation', formData);
    },

    subscribe: function (id) {
      console.log("sub service");
      return $http.get('http://127.0.0.1:3000/user/subscribe/' + id);
    },

    unsubscribe: function (id) {
      console.log("unsub service");
      return $http.get('http://127.0.0.1:3000/user/unsubscribe/' + id);
    },

    rate: function (star, bid) {
      console.log("rate service");
      return $http.get('http://127.0.0.1:3000/user/rate/' + star + "/" + bid);
    },

    public: function () {
      console.log('public service');
      return $http.get('http://127.0.0.1:3000/business/publicPage', { withCredentials: true });
    },

    remove: function () {
      console.log('remove service');
      return $http.get('http://127.0.0.1:3000/business/requestRemoval');
    },

    deleteImage: function (image) {
      console.log('delete image service');
      return $http.get('http://127.0.0.1:3000/business/deleteImage/' + image);
    },

    addImage: function (data) {
      console.log('add image service');
      var fd = new FormData();
      for (var key in data)
        fd.append(key, data[key]);

      console.log(fd);
      return $http.post('http://127.0.0.1:3000/business/editInformation', fd, {
        transformRequest: angular.identity,
        headers: { 'Content-Type': undefined }
      });
    },

    deletePhone: function (phone) {
      console.log('delete phone service');
      console.log(phone);
      return $http.get('http://127.0.0.1:3000/business/deletePhone/' + phone);
    },

    deletePaymentMethod: function (method) {
      console.log('delete payment method service');
      console.log(method);
      return $http.get('http://127.0.0.1:3000/business/deletePaymentMethod/' + method);
    },
    addReview: function (params) {
      return $http.post('http://127.0.0.1:3000/reviews/writeReview', params);
    },
    deleteReview: function (params) {
      return $http.post('http://127.0.0.1:3000/reviews/deleteReview', params);
    },
    addReply: function (params) {
      return $http.post('http://127.0.0.1:3000/reviews/replyReview', params);
    },
    deleteReply: function (params) {
      return $http.post('http://127.0.0.1:3000/reviews/deleteReply', params);
    },
    upvote: function (params) {
      return $http.post('http://127.0.0.1:3000/reviews/upvoteReview', params);

    },
    downvote: function (params) {
      return $http.post('http://127.0.0.1:3000/reviews/downvoteReview', params);
    }



  }
}]);
