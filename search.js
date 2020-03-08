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