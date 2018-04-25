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

  var user_preferences;
  $http.get('/getUserPreferences').success(function(e) {
    user_preferences = e;
    $scope.rating = e[0][1];
    $scope.price_range = e[0][2];
    angular.element( document.querySelector('#price_range_'+e[0][2])).attr('selected','');
    angular.element( document.querySelector('#zipcode_text')).html(e[0][3]);
    angular.element( document.querySelector('#safety_tolerance_'+e[0][4])).attr('selected','');
  });


  $scope.submit = function() {
    var data = {rating: $scope.rating,
      price_range: $scope.price_range,
      zipcode: $scope.zipcode,
      safety_tolerance: $scope.safety_tolerance};

    console.log(data);
    var correct = true;

    if(data.rating && data.rating.trim() != '') {
      var i = parseInt(data.rating);
      if(!Number.isInteger(i)) {
        angular.element( document.querySelector('#rating')).attr('data-validate', 'Rating must be an integer');
        angular.element( document.querySelector('#rating')).addClass('alert-validate');
        correct = false;
      } else if (i < 1 || i > 5) {
        angular.element( document.querySelector('#rating')).attr('data-validate', 'Rating must be between 1-4');
        angular.element( document.querySelector('#rating')).addClass('alert-validate');
        correct = false;
      } else {
        //save rating
        angular.element( document.querySelector('#rating')).removeClass('alert-validate');
        $http.get('/saveRating', {params: data}).success(function() {
          console.log("Rating saved!")
        })
      }
    } else {
      angular.element( document.querySelector('#rating')).removeClass('alert-validate');
    }

    if(data.price_range) {
      $http.get('/savePriceRange', {params: data}).success(function() {
        console.log("Price range saved!")
      })
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
            $http.get('/saveZipcode', {params: data}).success(function() {
              console.log("Zipcode saved!")
            })
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
      if (data.safety_tolerance == 1) {
        data.safety_tolerance = 1453;
      } else if (data.safety_tolerance == 2) {
        data.safety_tolerance = 6608;
      } else if (data.safety_tolerance == 3) {
        data.safety_tolerance = 16799;
      } else {
        data.safety_tolerance = 54126;
      }
      $http.get('/saveSafetyTolerance', {params: data}).success(function() {
        console.log("Safety tolerance saved!")
      })
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
