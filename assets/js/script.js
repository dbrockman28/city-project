var clearHistoryEl = document.getElementById("clear-history");
var historyEl = document.getElementById("movie-history");
var searchHistory = JSON.parse(localStorage.getItem("search")) || [];

let displayError = function(text) {
  let errorText = document.createElement("p");
  errorText.innerHTML = text;
  let errorTextEl = document.body;
  errorTextEl.appendChild(errorText);
}

let getStream = function (input) {
  fetch("https://rapidapi.p.rapidapi.com/lookup?term=" + input + "&country=us", {
    "method": "GET",
    "headers": {
      "x-rapidapi-key": "786577e5f2msh5a37d5421a86c8fp1cde07jsn46e335d06b99",
      "x-rapidapi-host": "utelly-tv-shows-and-movies-availability-v1.p.rapidapi.com"
    }
  }).then(function (response) {
    if (response.ok) {
      response.json().then(function (data) {
        displayResults(data);
      });
    } else {
      displayError("Error: " + response.statusText);
    }
  })
    .catch(function (error) {
      displayError("Unable to connect to Utelly")
    })
};

let getReview = function (input) {
  fetch("https://api.nytimes.com/svc/movies/v2/reviews/search.json?query=" + input + "&api-key=tBUQTtI1tnfA4wttm49bSlGoCL53eOaO")
    .then(function (response) {
      if (response.ok) {
        response.json().then(function (data) {
          displayReviews(data);
        });
      } else {
        displayError("Unable to connect to New York Times")
      }
    })
};

let submitButton = document.getElementById("submit");
  submitButton.addEventListener("click", e => {
    e.preventDefault();
    let value = document.getElementById("search").value;
    if (value.length > 0) {
      getStream(value);
      getReview(value);
      searchHistory.push(value);
      localStorage.setItem("search",JSON.stringify(searchHistory));
    }
    document.getElementById("search").value = '';
    displaySearchHistory();
});

let displayResults = function (data) {

  // search results div 
  let searchResultsEl = document.getElementById("searchResults");
  searchResultsEl.innerHTML = "";
  let results = data.results;

  results.forEach((result, index) => {

    // div set as a column to hold each result
    let containerEl = document.createElement("div");
    containerEl.classList.add("col");
    searchResultsEl.appendChild(containerEl);

    // card div to hold each movie's results 
    let cardContainer = document.createElement("div");
    cardContainer.classList.add("card", "large");
    containerEl.appendChild(cardContainer);

    // movie titles are set as span elements now bc of card-title class
    let imageContainer = document.createElement("div");
    imageContainer.classList.add("card-image");
    cardContainer.appendChild(imageContainer);

    let image = document.createElement("img");
    image.src = result.picture;
    image.alt = result.name;
    imageContainer.appendChild(image);

    let titleEl = document.createElement("span");
    titleEl.classList.add("card-title");
    titleEl.innerText = result.name;
    cardContainer.appendChild(titleEl);

    let serviceDiv = document.createElement("div");
    serviceDiv.classList.add("card-content");
    cardContainer.appendChild(serviceDiv);

    let serviceText = document.createElement("p");
    serviceText.classList.add("stream-it")
    serviceText.textContent = "Stream it here:";
    serviceDiv.appendChild(serviceText);

    result.locations.forEach((location, index) => {

      let icon = document.createElement("img");
      icon.classList.add("serviceImg");
      icon.src = location.icon;
      icon.alt = location.display_name;
      serviceDiv.appendChild(icon);

      icon.addEventListener("click", e => {
        window.location.target = "_blank";
        window.location.href = location.url;
      });
    });
    cardContainer.addEventListener("click", e => {
      getReview(data.name);
    })
  })
}

let displayReviews = function (data) {

  let reviewResultsEl = document.getElementById("reviewResults");
  reviewResultsEl.innerHTML = "";
  let results = data.results;

  results.forEach((result, index) => {
    
    // div set as a column for each review result 
    let containerEl = document.createElement("div");
    containerEl.classList.add("col");
    reviewResultsEl.appendChild(containerEl);

    // card div to hold each 's review 
    let cardContainer = document.createElement("div");
    cardContainer.classList.add("card", "large");
    containerEl.appendChild(cardContainer);

    let titleEl = document.createElement("span");
    titleEl.classList.add("card-title");
    titleEl.innerHTML = result.display_title;
    cardContainer.appendChild(titleEl);

    // review summary - hide overflow 
    let summaryEl = document.createElement("div");
    summaryEl.classList.add("card-content");
    let summaryText = document.createElement("p");
    summaryText.classList.add("summary");
    summaryText.innerHTML = result.summary_short;
    summaryEl.appendChild(summaryText);
    cardContainer.appendChild(summaryEl);

    let linkContainer = document.createElement("div");
    linkContainer.classList.add("card-action");
    cardContainer.appendChild(linkContainer);
    // links as card-action to go to NYT review
    let reviewLink = document.createElement("a");
    reviewLink.classList.add("blue-text", "text-darken-4");
    reviewLink.innerHTML = result.link.suggested_link_text;
    reviewLink.href = result.link.url;
    linkContainer.appendChild(reviewLink);
  })
};

clearHistoryEl.addEventListener("click",function(){
  searchHistory = [];
  localStorage.setItem("search",JSON.stringify(searchHistory));
  displaySearchHistory();
  document.getElementById("reviewResults").innerHTML = "";
  document.getElementById("searchResults").innerHTML = "";
})

function displaySearchHistory() {
  historyEl.innerHTML = "";

  for (var i = 0; i < searchHistory.length; i++) {
    var pastMovie = document.createElement("li");
    pastMovie.classList.add("searchList", "blue", "darken-4");
    pastMovie.innerHTML= searchHistory[i];
    //pastMovie.setAttribute("value", searchHistory[i]);
    let movieName = searchHistory[i];
    pastMovie.addEventListener("click",function(){
      getStream(movieName);
      getReview(movieName);
    })
    historyEl.append(pastMovie);
  }
}
displaySearchHistory();
if (searchHistory.length > 0) {
  displayResults(searchHistory[searchHistory.length - 1]);
}