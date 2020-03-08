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
      zoom: 15
    });

  });


function onLoad() {
    console.log("Console test");
    document.getElementById("greeting").innerHTML = "<div><p class='lead'>Hello! Nice to meet you.</p></div><div><p>Please enable location services to continue.</p></div>";
    getUserLocation();
}

function getUserLocation() {
    console.log("ran GetUserLocation");
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(passPosition);        
    }
}

function passPosition(position) {
    console.log("ran passPosition");
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