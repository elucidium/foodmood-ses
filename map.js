var map;
var view;
var pointsLayer;
var pointsArray = [];
var userLatitude = 0;
var userLongitude = 0;
var data;

// Prevent form from refreshing the page upon pressing 'enter', then initiate search.
$("form").submit(function (e) {
    e.preventDefault();
    console.log("Search initiated");
    search();
});

// Initialize the ArcGIS map.
require([
    "esri/Map",
    "esri/views/MapView",
    "esri/layers/GraphicsLayer"
  ], function(Map, MapView, GraphicsLayer) {
    map = new Map({
      basemap: "topo-vector"
    });

    view = new MapView({
      container: "map-view",
      map: map,
      center: [userLongitude, userLatitude],
      zoom: 15
    });
    pointsLayer = new GraphicsLayer({
        graphics: pointsArray
    });
    map.add(pointsLayer);
/*
    map.on("load", function() {
        var gl = new GraphicsLayer();
        data.forEach(business => {
            var point = new Pointer(business.coordinates.longitude, business.coordinates.latitude);
            var symbol = new SimpleMarkerSymbol().setSize(30);
            var pointGraphic = new Graphic(p, s);
            gl.add(pointGraphic);
        })
        map.addLayer(gl);
    });*/
    /*if (typeof data != "undefined") {
        data.forEach(business => {
            console.log("Trying to make point");
            var point = {
                type: "point",
                longitude: business.coordinates.longitude,
                latitude: business.coordinates.latitude
            };
            var symbol = {
                type: "simple-marker",
                color: [226, 119, 40], // CHANGE TO LOGO COLOR LATER
                outline: {
                    color: [255, 255, 255],
                    width: 2
                }
            };
            var pointGraphic = new pointGraphic({
                geometry: point,
                symbol: symbol
            });
            
            view.graphics.add(pointGraphic);
        });
    }*/

  });

// Upon page loading, prompt user to enable location services, then get the user's location.
function onLoad() {
    console.log("Console test");
    document.getElementById("greeting").innerHTML = "<div><p class='lead'>Hello! Nice to meet you.</p></div><div><p>Please enable location services to continue.</p></div>";
    getUserLocation();
}

// Get the user's location.
function getUserLocation() {
    console.log("ran GetUserLocation");
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(passPosition);        
    }
}

// Function that handles the user location and then updates the website's user prompt.
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
    document.getElementById("greeting").innerHTML = "<div><p class='lead'>Good " + time + "! What would you like to eat?</p></div>";
}

function search() {
    console.log("Using search");
    'use strict';
    document.getElementById('output').innerHTML = '<p style="text-align:center">Searching Yelp...</p>';
    var request = new XMLHttpRequest();
    var term = document.getElementById('search').value; // TODO fix this
    request.open('GET', 'https://cors-anywhere.herokuapp.com/https://api.yelp.com/v3/businesses/search?latitude='+userLatitude+'&longitude='+userLongitude+'&term='+term, true);
    request.setRequestHeader("Authorization", "Bearer te408GrT8_MYTERNfuzhCx7tg7Z_eYjgtctRUhuUf_64G0eMygUST-N-1zqPCa-OB8thDcwKdH1EUhXsIlOEU7q0geAw64gCPNp-p-8_mkpiVwLXS6bCLrfqVgVkXnYx");
    request.onload = function() {
        data = JSON.parse(this.response).businesses;
        if (request.status >= 200 && request.status < 400) {
            console.log("Made it through the call!");
            //document.getElementById('output').innerHTML = (JSON.stringify(data));
            document.getElementById('output').innerHTML = '';
            data.forEach(business => {
                //document.getElementById('output').append(business.name);
                const card = document.createElement('div');
                card.setAttribute('class', 'card');
                //  link="#861c5e" vlink="#a82475" alink="#bd2884"
                const h1 = document.createElement('h1');
                h1.innerHTML = '<a href="' + business.url + '" target="blank" rel="noopener noreferrer">' + business.name + '</a>';
                h1.setAttribute('class', 'logo-purple');
                const p1 = document.createElement('p');
                
                var price = business.price;
                if (typeof price == "undefined") price = "unspecified";
                var distance = business.distance;
                distance = (distance / 1000).toFixed(2);
                p1.textContent = 'rating: ' + business.rating + "/5 | price range: " + price + " | distance: " + distance + " km";
                card.appendChild(h1);
                card.appendChild(p1);
                document.getElementById('output').appendChild(card);
            });
            require(["esri/layers/GraphicsLayer", "esri/Graphic"], function(GraphicsLayer, Graphic) {
                var layer = new GraphicsLayer();
                data.forEach(business => {
                    var point = {
                        type: "point",
                        longitude: business.coordinates.longitude,
                        latitude: business.coordinates.latitude
                    };
                    var symbol = {
                        type: "simple-marker",
                        color: [35, 102, 69],
                        outline: {
                            color: [255, 255, 255],
                            width: 2
                        }
                    };
                    var pointGraphic = new Graphic({
                        geometry: point,
                        symbol: symbol
                    });
                    layer.add(pointGraphic);
                })
                map.add(layer);
            })
        } else {
            alert("Error occurred while searching Yelp.")
        }
    }
    request.send();
}