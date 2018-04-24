var app = angular.module('signup',[]);

app.controller('sign-up', function($scope, $http, $window) {
  $scope.submit = function() {
    var data = {username: $scope.username, password: $scope.password, confirm_password: $scope.confirm_password};
    var correct = true;

    if(!(data.username) || data.username.trim() == '') {
      angular.element( document.querySelector('#username')).attr('data-validate', 'Username is required');
      angular.element( document.querySelector('#username')).addClass('alert-validate');
      correct = false;
    } else {
      angular.element( document.querySelector('#username')).removeClass('alert-validate');
    }

    if(!(data.password) || data.password.trim() == '') {
      angular.element( document.querySelector('#password')).attr('data-validate', 'Password is required');
      angular.element( document.querySelector('#password')).addClass('alert-validate');
      correct = false;
    } else {
      angular.element( document.querySelector('#password')).removeClass('alert-validate');
    }

    if(!(data.confirm_password) || data.confirm_password.trim() == '') {
      angular.element( document.querySelector('#confirm_password')).attr('data-validate', 'Password confirmation is required');
      angular.element( document.querySelector('#confirm_password')).addClass('alert-validate');
      correct = false;
    } else if (!(data.password) || data.password != data.confirm_password) {
      angular.element( document.querySelector('#confirm_password')).attr('data-validate', 'Does not match password');
      angular.element( document.querySelector('#confirm_password')).addClass('alert-validate');
      correct = false;
    } else {
      angular.element( document.querySelector('#confirm_password')).removeClass('alert-validate');
    }

    if(correct) {
      $http.get('/checkUsernameExists', {params: data}).success(function(exists) {
        if (exists.length == 0) {
          $http.get('/addNewUser', {params: data}).success(function() {
            console.log('posted successfully');
            $window.location.href = '/';
          });
        } else {
          angular.element( document.querySelector('#username')).attr('data-validate', 'Username already exists');;
          angular.element( document.querySelector('#username')).addClass('alert-validate');
        }
      });
    }

  }

});
