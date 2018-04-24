var app = angular.module('index',[]);

app.controller('log-in', function($scope, $http, $window) {
  $scope.submit = function() {
    var data = {username: $scope.username, password: $scope.password, confirm_password: $scope.confirm_password};
    var correct = true;

    if(!(data.username) || data.username.trim() == '') {
      angular.element( document.querySelector('#username')).attr('data-validate', 'Username is required');;
      angular.element( document.querySelector('#username')).addClass('alert-validate');
      correct = false;
    } else {
      angular.element( document.querySelector('#username')).removeClass('alert-validate');
    }

    if(!(data.password) || data.password.trim() == '') {
      angular.element( document.querySelector('#password')).addClass('alert-validate');
      correct = false;
    } else {
      angular.element( document.querySelector('#password')).removeClass('alert-validate');
    }

    if(correct) {
      $http.get('/checkUsernameExists', {params: data}).success(function(exists) {
        if (exists.length == 1) {
          if(exists[0][1] == data.password) {
            console.log(data);
            $http.get('/setUsername', {params: data}).success(function() {
              $window.location.href = '/main';
            })
          }
        } else {
          angular.element( document.querySelector('#username')).attr('data-validate', 'User does not exist');
          angular.element( document.querySelector('#username')).addClass('alert-validate');
        }
      });
    }

  }

});
