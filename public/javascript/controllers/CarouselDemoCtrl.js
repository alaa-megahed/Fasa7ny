app.controller('CarouselDemoCtrl', function ($scope){
  $scope.myInterval = 3000;
  $scope.slides = [
    {
      image: '../img/blog/bicycle.jpg'
    },
    {
      image: '../img/portfolio/port1.jpg'
    },
    {
      image: '../img/portfolio/portfolio.jpg'
    },
    {
      image: '../img/portfolio/wide-port1.jpg'
    }
  ];
});
