let getStream = function(input) {
  fetch("https://rapidapi.p.rapidapi.com/lookup?term=" + input + "&country=us", {
    "method": "GET",
    "headers": {
      "x-rapidapi-key": "786577e5f2msh5a37d5421a86c8fp1cde07jsn46e335d06b99",
      "x-rapidapi-host": "utelly-tv-shows-and-movies-availability-v1.p.rapidapi.com"
    }
  }).then(function(response) {
    if (response.ok) {
      response.json().then(function(data) {
        console.log(data);
      });
    } else {
      alert("Error: " + response.statusText);
    }
  })
  .catch(function(error) {
    alert("Unable to connect to Utelly")
  })
};

let getReview = function(input) {
  fetch("https://api.nytimes.com/svc/movies/v2/reviews/search.json?query=" + input + "&api-key=tBUQTtI1tnfA4wttm49bSlGoCL53eOaO")
  .then(function(response) {
    if (response.ok) {
      response.json().then(function(data) {
        console.log(data);
      });
    } else {
      alert("Unable to connect to New York Times")
    }
  })
};