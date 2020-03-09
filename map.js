// Variable declarations used throughout the app.

var map;
var view;
var pointsLayer;
var pointsArray = [];
var userLatitude = 0;
var userLongitude = 0;
var data;

// Initialize the ArcGIS map.
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

// Upon page loading, prompt user to enable location services, then get the user's location.
function onLoad() {
    document.getElementById("greeting").innerHTML = "<div><p class='lead'>Hello! Nice to meet you.</p></div><div><p>Please enable location services to continue.</p></div>";
    getUserLocation();
}

// Get the user's location.
function getUserLocation() {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(passPosition);        
    }
}

// Function that handles the user location and then updates the website's user prompt.
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
    document.getElementById("greeting").innerHTML = "<div><p class='lead'>Good " + time + "! What would you like to eat?</p></div>";
}