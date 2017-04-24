var app = angular.module('fasa7ny');
app.service('Global', ['$http' , '$q', function($http, $q) 
{
  
  // this.currentBusinessPage;
  // this.currentOnceEvent;

  this.setBusiness = function(name){
  	this.currentBusinessPage = name; //get business id;
  }
  this.getBusiness = function (){
  	console.log("global service "+this.currentBusinessPage);
  	return this.currentBusinessPage;
  }

  this.setOnceEvent = function (id){ //by name?
  	this.currentOnceEvent = id;
  }

  this.getOnceEvent = function (){
  	return this.currentOnceEvent;
  }


}]);

