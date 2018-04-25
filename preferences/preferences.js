var app = angular.module('preferences',['checklist-model']);

app.controller('pref', function($scope, $http, $window) {
  $scope.cuisineList = [
    {name:"Mexican", selected: false},
    {name:"Bars", selected: false},
    {name:"Nightlife", selected: false},
    {name:"American (Traditional)", selected: false},
    {name:"Sandwiches", selected: false},
    {name:"Pizza", selected: false},
    {name:"Burgers", selected: false},
    {name:"Coffee", selected: false},
    {name:"Chinese", selected: false},
    {name:"Breakfast", selected: false},
    {name:"Italian", selected: false},
    {name:"Seafood", selected: false},
    {name:"Cafes", selected: false},
    {name:"Salad", selected: false},
    {name:"Steakhouses", selected: false},
    {name:"Desserts", selected: false}
  ];

  //initialize cuisine preferences
  for(var i = 0; i < $scope.cuisineList.length; i++) {
    (function(i) {
      $http.get('/checkCuisinePrefs', {params: {cuisine:$scope.cuisineList[i].name}}).success(function(e) {
        if (e.length == 1) {
          $scope.cuisineList[i].selected = true;
        }
      })
    })(i);
  }

  var user_preferences;
  $http.get('/getUserPreferences').success(function(e) {
    user_preferences = e;
    $scope.rating = e[0][1];
    $scope.price_range = e[0][2];
    $scope.zipcode = e[0][3];
    $scope.safety_tolerance = e[0][4];
  });


  $scope.submit = function() {
    var data = {rating: $scope.rating,
      price_range: $scope.price_range,
      zipcode: $scope.zipcode,
      safety_tolerance: $scope.safety_tolerance};

    console.log(data);

    if(data.rating) {
      var i = parseInt(data.rating);
      if(!Number.isInteger(i)) {
        angular.element( document.querySelector('#rating')).attr('data-validate', 'Rating must be an integer');
        angular.element( document.querySelector('#rating')).addClass('alert-validate');
      } else if (i < 1 || i > 5) {
        angular.element( document.querySelector('#rating')).attr('data-validate', 'Rating must be between 1-4');
        angular.element( document.querySelector('#rating')).addClass('alert-validate');
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

    if(data.price_range != 0) {
      $http.get('/savePriceRange', {params: data}).success(function() {
        console.log("Price range saved!")
      })
    }

    if(data.zipcode) {
      var i = parseInt(data.zipcode);
      if(!Number.isInteger(i)) {
        angular.element( document.querySelector('#zipcode')).attr('data-validate', 'Zipcode must be an integer');
        angular.element( document.querySelector('#zipcode')).addClass('alert-validate');
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
    if(data.safety_tolerance != 0) {
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

    //save cuisine preferences
    for(var i = 0; i < $scope.cuisineList.length; i++) {
      (function(i) {
        $http.get('/checkCuisinePrefs', {params: {cuisine:$scope.cuisineList[i].name}}).success(function(e) {
          if($scope.cuisineList[i].selected && e.length == 0) {
            $http.get('/saveCuisinePrefs', {params: {cuisine:$scope.cuisineList[i].name}}).success(function(e) {
              console.log("Cuisine pref for "+ $scope.cuisineList[i].name + " saved!")
            })
          } else if (!$scope.cuisineList[i].selected &&  e.length == 1) {
            $http.get('/deleteCuisinePrefs', {params: {cuisine:$scope.cuisineList[i].name}}).success(function(e) {
              console.log("Cuisine pref for "+ $scope.cuisineList[i].name + " deleted!")
            })
          }
        })
      })(i);
    }
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
