app.factory('Global', [function() {
  
  var currentBusinessPage = {}

  function setBusiness(name){
  	currentBusinessPage = name; //get business if;
  }
  function getBusiness(){
  	return currentBusinessPage;
  }

  return {
  setBusiness: setBusiness,
  getBusiness: getBusiness
 }

}]);


