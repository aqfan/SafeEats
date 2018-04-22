var app = angular.module('fibApp',[]);
app.controller('fibController', function($scope) {
	$scope.prevVal = 0;
    $scope.val = 1;
    $scope.nextVal = function() {
    	next = $scope.val + $scope.prevVal;
    	$scope.prevVal = $scope.val;
    	$scope.val = next;
    	return $scope.val;
    }
});