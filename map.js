var map;
var view;
var userLatitude = 0;
var userLongitude = 0;
var data;

$("form").submit(function (e) {
    e.preventDefault();
    console.log("Search initiated");
    search();
});

require([
    "esri/Map",
    //"esri/geometry/Point",
    //"esri/symbols/SimpleMarkerSymbol",
    "esri/views/MapView",
    //"esri/Graphic",
    //"esri/layers/GraphicsLayer"
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
    if (typeof data != "undefined") {
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
    }

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
                const h1 = document.createElement('h1');
                h1.textContent = business.name;
                h1.setAttribute('class', 'logo-purple');
                const p1 = document.createElement('p');
                p1.textContent = 'Rating: ' + business.rating;
                const p2 = document.createElement('p');
                p2.textContent = 'Price: ' + business.price;
                card.appendChild(h1);
                card.appendChild(p1);
                card.appendChild(p2);
                document.getElementById('output').appendChild(card);
                /*var point = {
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
                
                map.graphics.add(pointGraphic);*/
            });
        } else {
            alert("Error occurred while searching Yelp.")
        }
    }
    
    request.send();
}