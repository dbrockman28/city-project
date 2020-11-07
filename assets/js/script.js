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
        console.log(data);
        displayResults(data);
      });
    } else {
      alert("Error: " + response.statusText);
    }
  })
    .catch(function (error) {
      alert("Unable to connect to Utelly")
    })
};

let getReview = function (input) {
  fetch("https://api.nytimes.com/svc/movies/v2/reviews/search.json?query=" + input + "&api-key=tBUQTtI1tnfA4wttm49bSlGoCL53eOaO")
    .then(function (response) {
      if (response.ok) {
        response.json().then(function (data) {
          console.log(data);
          displayReviews(data);
        });
      } else {
        alert("Unable to connect to New York Times")
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
    }
});

let displayResults = function (data) {
  let container = document.getElementById("searchResults");
  container.innerHTML = "";
  let results = data.results;
  results.forEach((result, index) => {
    let card = document.createElement("div");
    card.classList.add("resultCard");
    container.appendChild(card);
    let imageContainer = document.createElement("div");
    imageContainer.classList.add("imageContainer");
    card.appendChild(imageContainer);
    let image = document.createElement("img");
    image.classList.add("movieImage");
    image.src = result.picture;
    image.alt = result.name;
    imageContainer.appendChild(image);
    let title = document.createElement("h2");
    title.classList.add("title");
    title.innerText = result.name;
    card.appendChild(title);
    let services = document.createElement("div");
    services.classList.add("servicesList");
    card.appendChild(services);
    result.locations.forEach((location, index) => {
      let serviceDiv = document.createElement("div");
      serviceDiv.classList.add("service");
      services.appendChild(serviceDiv);
      let icon = document.createElement("img");
      icon.src = location.icon;
      icon.alt = location.display_name;
      serviceDiv.appendChild(icon);
      serviceDiv.addEventListener("click", e => {
        window.location.target = "_blank";
        window.location.href = location.url;
      });
    });
    card.addEventListener("click", e => {
      getReview(data.name);
    })
  })
}

let displayReviews = function (data) {
  let container = document.getElementById("reviewResults");
  container.innerHTML = "";
  let results = data.results;
  results.forEach((result, index) => {
    let card = document.createElement("div");
    card.classList.add("resultCard");
    container.appendChild(card);
    let title = document.createElement("h2");
    title.classList.add("title");
    title.innerHTML = result.display_title;
    card.appendChild(title);
    let summary = document.createElement("div");
    let summaryText = document.createElement("p");
    summaryText.innerHTML = result.summary_short;
    summary.appendChild(summaryText);
    card.appendChild(summary);
    let reviewLink = document.createElement("a");
    reviewLink.innerHTML = result.link.suggested_link_text;
    reviewLink.href = result.link.url;
    card.appendChild(reviewLink);
  })
}