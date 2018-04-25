var app = angular.module("saved_restaurants", []);
app.controller("ListController", function($scope, $http) {
  $scope.myRestaurants = [];

  $http.get('/getMyRestaurants').success(function(arr) {
    if (arr.length > 0) {
      for(var i = 0; i < arr.length; i++) {
        var element = {};

        var dollarText = "";
        for(var b = 0; b < arr[i][2]; b++) {
          dollarText = dollarText + "$";
        }
        var crimeText = "";
        if (arr[i][5] < 1453) {
          crimeText = 'Safe';
        } else if (arr[i][5] < 6608) {
          crimeText = 'Relatively Safe';
        } else if (arr[i][5] < 16799) {
          crimeText = 'A little dangerous';
        } else {
          crimeText = 'Dangerous';
        }

        element.name = arr[i][0];
        element.address = arr[i][3];
        element.rating = arr[i][1];
        element.price_range = dollarText;
        element.crime_rate = crimeText;
        element.id = arr[i][6];
        $scope.myRestaurants.push(element);
      }
    }
  })



        $scope.remove = function(){
            var newDataList=[];
            $scope.selectedAll = false;
            angular.forEach($scope.myRestaurants, function(selected){
                if(!selected.selected){
                    newDataList.push(selected);
                } else {
                  //delete from myRestaurants
                  console.log(selected);
                  $http.get('/deleteMyRestaurants', {params: selected}).success(function(e) {
                    console.log("Deleted " + e);
                  })
                }
            });
            $scope.myRestaurants = newDataList;
        };

    $scope.checkAll = function () {
        if (!$scope.selectedAll) {
            $scope.selectedAll = true;
        } else {
            $scope.selectedAll = false;
        }
        angular.forEach($scope.myRestaurants, function(personalDetail) {
            personalDetail.selected = $scope.selectedAll;
        });
    };


});
