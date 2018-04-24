var app = angular.module('homeApp',[]);
app.controller('homeController', function($scope, $http) {
    $scope.restaurant = "";
    $scope.submit = function(){
        if ($scope.input)
            $scope.restaurant = $scope.input;
    }
    console.log("yes");
    $http.get('/getAllRest').success(function(data){
      console.log(data + ' posted successfully');
      $scope.data = data;
    });
});

var map;
function initMap() {
    map = new google.maps.Map(document.getElementById('map'), {
      center: {lat: 36.114647, lng: -115.172813},
      zoom: 8
    });

        // Create the search box and link it to the UI element.
    var input = document.getElementById('pac-input');
    var searchBox = new google.maps.places.SearchBox(input);
    map.controls[google.maps.ControlPosition.TOP_LEFT].push(input);

    // Bias the SearchBox results towards current map's viewport.
    map.addListener('bounds_changed', function() {
      searchBox.setBounds(map.getBounds());
    });

    var markers = [];
    // Listen for the event fired when the user selects a prediction and retrieve
    // more details for that place.
    searchBox.addListener('places_changed', function() {
      var places = searchBox.getPlaces();

      if (places.length == 0) {
        return;
      }

      // Clear out the old markers.
      markers.forEach(function(marker) {
        marker.setMap(null);
      });
      markers = [];

      // For each place, get the icon, name and location.
      var bounds = new google.maps.LatLngBounds();
      places.forEach(function(place) {
        if (!place.geometry) {
          console.log("Returned place contains no geometry");
          return;
        }
        var icon = {
          url: place.icon,
          size: new google.maps.Size(71, 71),
          origin: new google.maps.Point(0, 0),
          anchor: new google.maps.Point(17, 34),
          scaledSize: new google.maps.Size(25, 25)
        };

        // Create a marker for each place.
        markers.push(new google.maps.Marker({
          map: map,
          icon: icon,
          title: place.name,
          position: place.geometry.location
        }));

        if (place.geometry.viewport) {
          // Only geocodes have viewport.
          bounds.union(place.geometry.viewport);
        } else {
          bounds.extend(place.geometry.location);
        }
      });
      map.fitBounds(bounds);
    });
}

$(function(){
  $(".action-logout").click(function(e){
    fblogout();
    console.log("BYE");
    e.preventDefault();
  })
});

window.fbAsyncInit = function() {
  FB.init({
    appId      : '612209052456843',
    cookie     : true,
    xfbml      : true,
    version    : 'v2.8'
  });
    
  FB.AppEvents.logPageView();   
};

(function(d, s, id) {
  var js, fjs = d.getElementsByTagName(s)[0];
  if (d.getElementById(id)) return;
  js = d.createElement(s); js.id = id;
  js.src = 'https://connect.facebook.net/en_US/sdk.js#xfbml=1&version=v2.12&appId=612209052456843&autoLogAppEvents=1';
  fjs.parentNode.insertBefore(js, fjs);
}(document, 'script', 'facebook-jssdk'));


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
