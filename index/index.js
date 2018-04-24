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

var xhr = new XMLHttpRequest();
xhr.open('GET', '/server', true);

window.fbAsyncInit = function() {
  FB.init({
    appId      : '612209052456843',
    cookie     : true,
    xfbml      : true,
    version    : 'v2.8'
  });
    
  FB.AppEvents.logPageView();   

  function checkLoginState() {
    FB.getLoginStatus(function(response) {
      statusChangeCallback(response);
    });
  }

    function statusChangeCallback(response) {
      console.log('statusChangeCallback');
      console.log(response);
    }


    FB.getLoginStatus(function(response) {
        statusChangeCallback(response);
    });


    function testAPI() {
      console.log('Welcome!  Fetching your information.... ');
      FB.api('/me', function(response) {
         console.log('Successful login for: ' + response.name);
         console.log('Successful login for: ' + response.email);
      });
    }
    
};

(function(d, s, id) {
  var js, fjs = d.getElementsByTagName(s)[0];
  if (d.getElementById(id)) return;
  js = d.createElement(s); js.id = id;
  js.src = 'https://connect.facebook.net/en_US/sdk.js#xfbml=1&version=v2.12&appId=612209052456843&autoLogAppEvents=1';
  fjs.parentNode.insertBefore(js, fjs);
}(document, 'script', 'facebook-jssdk'));


function fblogin() {
  FB.login(function(response) {
    console.log("HI");
    FB.api('/me', function(response) {
         console.log('Successful login for: ' + response.name);
         window.location = '/main';
         // // need to send response.name -> to /checkUsernameExists?
         // $.post("checkUsernameExists",
         //    {
         //        username: response.name
         //    }
         // });
       });
    }, {scope: 'public_profile,email'}
  )
}

function fblogout() {
  FB.getLoginStatus(function(response) {
    console.log(response);
    if (response && response.status === 'connected') {
      FB.logout(function(response) {
        window.location = '/';
      });
    }
  });  
}

$(function(){
  $(".action-logout").click(function(e){
    fblogout();
    console.log("BYE");
    e.preventDefault();
  })
});
