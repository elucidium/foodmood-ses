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


function onLoad() {
    document.getElementById("greeting").innerHTML = "<div><p class='lead'>Hello!</p></div><div><p>Please enable location services to continue.</p></div>";
    getUserLocation();
}

function getUserLocation() {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(passPosition);
        
    }
}

function passPosition(position) {
    userLongitude = position.coords.longitude;
    userLatitude = position.coords.latitude;
    view.goTo([userLongitude, userLatitude]);
    var now = new Date();
    var time = '';
    var hours = now.getHours();
    if (4 <= hours && hours < 12) time = 'morning';
    else if (12 <= hours && hours < 18) time = 'afternoon';
    else time = 'evening';
    document.getElementById("greeting").innerHTML = "<div><p class='lead'>Good " + time + "! What do you want to eat?</p></div>";
}

function search() {
    var request = new XMLHttpRequest();
    var term = ''; // TODO fix this
    request.open('GET', 'https://api.yelp.com/v3/businesses/search?latitude='+userLatitude+'&longitude='+userLongitude+'&term='+term, true);
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