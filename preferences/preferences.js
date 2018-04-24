var app = angular.module('preferences',['checklist-model']);

app.controller('pref', function($scope, $http, $window) {
  $scope.cuisineList = [
    {name:"Mexican"},
    {name:"Bars"},
    {name:"Nightlife"},
    {name:"American (Traditional)"},
    {name:"Sandwiches"},
    {name:"Pizza"},
    {name:"Burgers"},
    {name:"Coffee"},
    {name:"Chinese"},
    {name:"Breakfast"},
    {name:"Italian"},
    {name:"Seafood"},
    {name:"Cafes"},
    {name:"Salad"},
    {name:"Steakhouses"},
    {name:"Desserts"}
  ];

  $scope.selected = {
    cuisine: []
  };

  $scope.submit = function() {
    var data = {rating: $scope.rating,
      price_range: $scope.price_range,
      zipcode: $scope.zipcode,
      safety_tolerance: $scope.safety_tolerance};
    var correct = true;

    if(data.rating && data.rating.trim() != '') {
      var i = parseInt(data.rating);
      if(!Number.isInteger(i)) {
        angular.element( document.querySelector('#rating')).attr('data-validate', 'Rating must be an integer');
        angular.element( document.querySelector('#rating')).addClass('alert-validate');
        correct = false;
      } else if (i < 1 || i > 5) {
        angular.element( document.querySelector('#rating')).attr('data-validate', 'Rating must be between 1-5');
        angular.element( document.querySelector('#rating')).addClass('alert-validate');
        correct = false;
      } else {
        //save rating
        angular.element( document.querySelector('#rating')).removeClass('alert-validate');
        // $http.get('/saveRating', {params: data}).success(function() {
        //   $window.location.href = '/main';
        // })
      }
    } else {
      angular.element( document.querySelector('#rating')).removeClass('alert-validate');
    }

    if(data.rating) {
      //save rating
    }

    if(data.zipcode && data.zipcode.trim() != '') {
      var i = parseInt(data.zipcode);
      if(!Number.isInteger(i)) {
        angular.element( document.querySelector('#zipcode')).attr('data-validate', 'Zipcode must be an integer');
        angular.element( document.querySelector('#zipcode')).addClass('alert-validate');
        correct = false;
      } else {
        $http.get('/checkPostalCodeExists', {params: data}).success(function(d) {
          if(d.length == 0) {
            angular.element( document.querySelector('#zipcode')).attr('data-validate', 'Zipcode is not in Las Vegas');
            angular.element( document.querySelector('#zipcode')).addClass('alert-validate');
          } else {
            //save zipcode
            angular.element( document.querySelector('#zipcode')).removeClass('alert-validate');
          }
        })
      }
    } else {
      angular.element( document.querySelector('#zipcode')).removeClass('alert-validate');
    }

    //crime_rates quantiles
    // 0.00        0.00
    // 0.25     1453.25
    // 0.50     6608.50
    // 0.75    16799.00
    // 1.00    54126.00
    if(data.safety_tolerance) {
      //save safety_tolerance
    }

    //check cuisine preferences
    console.log($scope.selected.cuisine);
    if($scope.selected.cuisine.length > 0) {
      //save cuisine preferences
    }

    if(correct) {
      // $http.get('/checkUsernameExists', {params: data}).success(function(exists) {
      //   if (exists.length == 0) {
      //     $http.get('/addNewUser', {params: data}).success(function() {
      //       console.log('posted successfully');
      //       $window.location.href = '/';
      //     });
      //   } else {
      //     angular.element( document.querySelector('#username')).attr('data-validate', 'Username already exists');;
      //     angular.element( document.querySelector('#username')).addClass('alert-validate');
      //   }
      // });
    }

  }

});
