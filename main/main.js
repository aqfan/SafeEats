var app = angular.module('homeApp',[]);
app.controller('homeController', function($scope, $http) {
    $scope.restaurant = "";
    $scope.submit = function(){
        if ($scope.input)
            $scope.restaurant = $scope.input;
    }
    // console.log("yes");
    // $http.get('/getAllRest').success(function(data){
    //   console.log(data + ' posted successfully');
    //   $scope.data = data;
    // });
});

var map;
function initMap() {
    map = new google.maps.Map(document.getElementById('map'), {
      center: {lat: 36.114647, lng: -115.172813},
      zoom: 8
    });
}
