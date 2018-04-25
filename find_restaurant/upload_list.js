var app = angular.module('selector',[]);

app.controller('images', function($scope, $http, $window) {
  $scope.imageList = [
    {name:"McDonald's", imagePath:"images/swiping_temp/Mcdonalds.jpg"},
    {name:"McDonald's", imagePath:"images/swiping_temp/Pattaya.jpg"},
    {name:"McDonald's", imagePath:"images/swiping_temp/Farmacy.jpg"},
    {name:"McDonald's", imagePath:"images/swiping_temp/Buddakan.jpg"}
  ];
});

app.controller('text', function($scope, $http, $window) {
  $scope.imageList = [
    {name:"McDonald's", imagePath:"images/swiping_temp/Mcdonalds.jpg"},
    {name:"McDonald's", imagePath:"images/swiping_temp/Pattaya.jpg"},
    {name:"McDonald's", imagePath:"images/swiping_temp/Farmacy.jpg"},
    {name:"McDonald's", imagePath:"images/swiping_temp/Buddakan.jpg"}
  ];
});
