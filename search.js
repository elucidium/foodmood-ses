// Prevent form from refreshing the page upon pressing 'enter', then initiate search.
$("form").submit(function (e) {
    e.preventDefault();
    search();
});

// Executed every time the form is submitted (i.e. 'enter' is pressed).
function search() {
    'use strict';
    // Prompt while search results are loading
    document.getElementById('output').innerHTML = '<p style="text-align:center">Searching Yelp...</p>';
    // JSON request
    var request = new XMLHttpRequest();
    var term = document.getElementById('search').value;
    request.open('GET', 'https://cors-anywhere.herokuapp.com/https://api.yelp.com/v3/businesses/search?latitude='+userLatitude+'&longitude='+userLongitude+'&term='+term, true);
    request.setRequestHeader("Authorization", "Bearer te408GrT8_MYTERNfuzhCx7tg7Z_eYjgtctRUhuUf_64G0eMygUST-N-1zqPCa-OB8thDcwKdH1EUhXsIlOEU7q0geAw64gCPNp-p-8_mkpiVwLXS6bCLrfqVgVkXnYx");
    // Response to JSON request
    request.onload = function() {
        data = JSON.parse(this.response).businesses;
        // Runs if the request was successful.
        if (request.status >= 200 && request.status < 400) {
            document.getElementById('output').innerHTML = '<p style="text-align:center">Click on the restaurants in the map to learn more.</p><p style="text-align:center"><em>Not feeling it? Try another search!</em></p>';
            // For each business, make a card with basic information and append to output.
            data.forEach(business => {
                const card = document.createElement('div');
                card.setAttribute('class', 'card');
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
            document.getElementById('output').append();
            // For each business, add a point to the ArcGIS map.
            require(["esri/layers/GraphicsLayer", "esri/Graphic"], function(GraphicsLayer, Graphic) {
                var pointsLayer = new GraphicsLayer();
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
                    var information = {
                        Name: business.name,
                        Category: business.categories.title,
                        Address: business.location.display_address,
                        Phone: business.display_phone,
                        Options: business.transactions
                    }
                    var pointGraphic = new Graphic({
                        geometry: point,
                        symbol: symbol,
                        attributes: information,
                        popupTemplate: {
                            title: "{Name}",
                            content: [
                              {
                                type: "fields",
                                fieldInfos: [
                                  { fieldName: "Name" },
                                  { fieldName: "Category" },
                                  { fieldName: "Address" },
                                  { fieldName: "Phone" },
                                  { fieldName: "Options" }
                                ]
                              }
                            ]
                          }
                    });
                    pointsLayer.add(pointGraphic);
                })
                map.removeAll();
                map.add(pointsLayer);
            })
        } else {
            alert("Error occurred while searching Yelp.")
        }
    }
    request.send();
}