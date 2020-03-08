$("form").submit(function (e) {
    e.preventDefault();
    console.log("Search initiated");
    search();
});

function search() {
    console.log("Using search");
    'use strict';
    
    /*const yelp = require('yelp-fusion');
    const apiKey = 'te408GrT8_MYTERNfuzhCx7tg7Z_eYjgtctRUhuUf_64G0eMygUST-N-1zqPCa-OB8thDcwKdH1EUhXsIlOEU7q0geAw64gCPNp-p-8_mkpiVwLXS6bCLrfqVgVkXnYx';

    const client = yelp.client(apiKey);

    const searchRequest = {
        longitude: userLongitude,
        latitude: userLatitude,
        term: document.getElementById('search').value 
    }

    client.search(searchRequest).then(response => {
        document.getElementById('output').innerHTML = response.toString();
    }).catch(e => {
        alert(e);
    })
    */
    var request = new XMLHttpRequest();
    request.setRequestHeader("Authorization", "Bearer te408GrT8_MYTERNfuzhCx7tg7Z_eYjgtctRUhuUf_64G0eMygUST-N-1zqPCa-OB8thDcwKdH1EUhXsIlOEU7q0geAw64gCPNp-p-8_mkpiVwLXS6bCLrfqVgVkXnYx");
    var term = 'sushi'; // TODO fix this
    request.open('GET', 'https://api.yelp.com/v3/businesses/search?latitude='+userLatitude+'&longitude='+userLongitude+'&term='+term, true);
    request.onload = function() {
        var data = JSON.parse(this.response);
        if (request.status >= 200 && request.status < 400) {
            data.forEach(field => {
                document.getElementById('output').append(field);
            })
        } else {
            // error out
        }
    }
    
    request.send();
}