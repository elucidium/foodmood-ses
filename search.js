// deprecated code; moved into map.js
$("form").submit(function (e) {
    e.preventDefault();
    console.log("Search initiated");
    search();
});

function search() {
    console.log("Using search");
    'use strict';
    document.getElementById('output').innerHTML = '';
    var request = new XMLHttpRequest();
    var term = document.getElementById('search').value; // TODO fix this
    request.open('GET', 'https://cors-anywhere.herokuapp.com/https://api.yelp.com/v3/businesses/search?latitude='+userLatitude+'&longitude='+userLongitude+'&term='+term, true);
    request.setRequestHeader("Authorization", "Bearer te408GrT8_MYTERNfuzhCx7tg7Z_eYjgtctRUhuUf_64G0eMygUST-N-1zqPCa-OB8thDcwKdH1EUhXsIlOEU7q0geAw64gCPNp-p-8_mkpiVwLXS6bCLrfqVgVkXnYx");
    request.onload = function() {
        data = JSON.parse(this.response).businesses;
        if (request.status >= 200 && request.status < 400) {
            console.log("Made it through the call!");
            //document.getElementById('output').innerHTML = (JSON.stringify(data));
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
                var pointGraphic = new esri.pointGraphic({
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