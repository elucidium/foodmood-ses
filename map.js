var map;
var view;
var userLatitude = 0;
var userLongitude = 0;

require([
    "esri/Map",
    "esri/views/MapView"
  ], function(Map, MapView) {

    map = new Map({
      basemap: "topo-vector"
    });

    view = new MapView({
      container: "map-view",
      map: map,
      center: [userLongitude, userLatitude],
      zoom: 13
    });

  });

function getUserLocation() {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(passPosition);
    }
}

function passPosition(position) {
    userLongitude = position.coords.longitude;
    userLatitude = position.coords.latitude;
    view.goTo([userLongitude, userLatitude]);
}

function search() {
    var request = new XMLHttpRequest();
    request.open('GET', 'placeholder', true);
    request.onload = function() {
        var data = JSON.parse(this.response);
        if (request.status >= 200 && request.status < 400) {
            data.forEach(field => {
                // do something here
            })
        } else {
            // error out
        }
    }
    request.send();
}