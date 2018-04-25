var app = angular.module('main',[]);

app.controller('getStarted', function($scope, $http, $window) {
  $scope.submit = function() {
    $window.location.href = '/find_restaurant';
  }
});

$(function(){
  $(".action-logout").click(function(e){
    $.ajax({
      url: "/logout",
      type: 'GET',
      success: function(res) {
        alert("You've been logged out!");
        window.location.href = "/";
      }
    })
  })
});
