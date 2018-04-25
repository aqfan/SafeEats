var app = angular.module('index',[]);

app.controller('log-in', function($scope, $http, $window) {
  $scope.submit = function() {
    var data = {username: $scope.username, password: $scope.password};
    var correct = true;

    if(!(data.username) || data.username.trim() == '') {
      angular.element( document.querySelector('#username')).attr('data-validate', 'Username is required');;
      angular.element( document.querySelector('#username')).addClass('alert-validate');
      correct = false;
    } else {
      angular.element( document.querySelector('#username')).removeClass('alert-validate');
    }

    if(!(data.password) || data.password.trim() == '') {
      angular.element( document.querySelector('#password')).attr('data-validate', 'Password is required');;
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
          } else {
            angular.element( document.querySelector('#password')).attr('data-validate', 'Password is incorrect');
            angular.element( document.querySelector('#password')).addClass('alert-validate');
          }
        } else {
          angular.element( document.querySelector('#username')).attr('data-validate', 'User does not exist');
          angular.element( document.querySelector('#username')).addClass('alert-validate');
        }
      });
    }

  }

});

$(function(){
  $(".action-logout").click(function(e){
    googlelogout();
    e.preventDefault();
  })
});

var googleUser = {};
function googlelogin() {
  gapi.load('auth2', function(){
    // Retrieve the singleton for the GoogleAuth library and set up the client.
    auth2 = gapi.auth2.init({
      client_id: '59500994529-anrq8k9gqqbpk6ed67rupqmvcrng3i2g.apps.googleusercontent.com',
      cookiepolicy: 'single_host_origin',
      // Request scopes in addition to 'profile' and 'email'
      scope: 'profile'
    });
    attachSignin(document.getElementById('customBtn'));
  });
};

function attachSignin(element) {
  console.log(element.id);
  auth2.attachClickHandler(element, {},
    function(googleUser) {
      var credential = {
        "username": googleUser.getBasicProfile().getEmail(),
        "password": googleUser.getBasicProfile().getName()
      }

      $.ajax({
        url: "/checkUsernameExists",
        type: 'GET',
        data: credential,
        success: function(exists) {
          if (exists.length == 1) {
            $.ajax({
              url: "/setUsername",
              type: 'GET',
              data: credential,
              success: function(e) {
                window.location.href = "/main";
              }, error: function(e) {
                console.log(e);
              }
            });
          } else {
            $.ajax({
              url: "/addNewUser",
              type: 'GET',
              data: credential,
              success: function(e) {
                $.ajax({
                  url: "/setUsername",
                  type: 'GET',
                  data: credential,
                  success: function(e) {
                    alert( "You did not previously have an account with us on your Google account - but now you do!");
                    window.location.href = "/main";
                  }
                });
              }
            });
          }
        }, error: function(e) {
          console.log(e);
        }
      });

    }, function(error) {
      console.log(error);
  });
}

function googlelogout() {
  $.ajax({
    url: "/logout",
    type: 'GET'
  })
}
