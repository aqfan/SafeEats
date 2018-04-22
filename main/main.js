var app = angular.module('homeApp',[]);
app.controller('homeController', function($scope) {
    $scope.restaurant = "";
    $scope.submit = function(){
        if ($scope.input)
            $scope.restaurant = $scope.input;
    }
});

var map;
function initMap() {
    map = new google.maps.Map(document.getElementById('map'), {
      center: {lat: 36.114647, lng: -115.172813},
      zoom: 8
    });
}
