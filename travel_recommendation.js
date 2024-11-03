const searchBtn = document.getElementById("btnSearch");
const clearBtn = document.getElementById("btnClear");
const results = [];

searchBtn.addEventListener("click", searchPlace);
clearBtn.addEventListener("click", clearSearch);

document.getElementById("btnSearch").addEventListener("click", function () {
  document.getElementById("searchResults").style.display = "flex";
});
document.getElementById("btnClear").addEventListener("click", function () {
  document.getElementById("searchResults").style.display = "none";
});

function clearSearch() {
  //done
  document.getElementById("conditionInput").value = "";
  searchResults.innerHTML = "";
}

function searchPlace() {
  const input = document.getElementById("conditionInput").value.toLowerCase();
  const searchResults = document.getElementById("searchResults");
  searchResults.innerHTML = ""; // Clear previous results

  fetch("./travel_recommendation_api.json")
    .then((response) => response.json())
    .then((data) => {
      let results = [];

      // Search within each category based on name match
      data.countries.forEach((country) => {
        // Search cities within each country
        country.cities.forEach((city) => {
          if (city.name.toLowerCase().includes(input)) {
            console.log("single city " + city.name);
            results.push({ ...city, country: country.name }); // Add country name to city result
          }
        });
      });
      data.countries.forEach((country) => {
        if (
          input.toLowerCase() === "country" ||
          input.toLowerCase() === "countries"
        ) {
          country.cities.forEach((city) => {
            console.log(city.name);
            results.push({ ...city, country: country.name });
          });
        }
      });

      data.temples.forEach((temple) => {
        if (temple.name.toLowerCase().includes(input)) {
          results.push(temple);
        }
      });
      //recommendation for temples
      data.temples.forEach((temple) => {
        if (
          input.toLowerCase() === "temple" ||
          input.toLowerCase() === "temples"
        ) {
          results.push(temple);
        }
      });

      data.beaches.forEach((beach) => {
        if (beach.name.toLowerCase().includes(input)) {
          results.push(beach);
        }
      });

      data.beaches.forEach((beach) => {
        if (
          input.toLowerCase() === "beach" ||
          input.toLowerCase() === "beaches"
        ) {
          results.push(beach);
        }
      });

      // Display results with image, name, country, and description
      var recommendationsCount = 0;
      results.forEach((place) => {
        const resultDiv = document.createElement("div");
        resultDiv.classList.add("result-item");

        // Image element
        const img = document.createElement("img");
        img.src = place.imageUrl;
        img.alt = place.name;
        img.classList.add("result-image");
        resultDiv.appendChild(img);

        // Place name (with country if available)
        const name = document.createElement("h3");
        name.classList.add("result-name");
        name.innerText = place.name;
        resultDiv.appendChild(name);

        // Country and city name
        if (place.country) {
          const location = document.createElement("p");
          location.classList.add("result-location");
          location.innerText = ` ${place.name}`;
          resultDiv.appendChild(location);
        }

        const timeZone = document.createElement("p");
        const options = {
          timeZone: place.timeZone,
          hour12: true,
          hour: "numeric",
          minute: "numeric",
          second: "numeric",
        };
        const newYorkTime = new Date().toLocaleTimeString("en-US", options);
        timeZone.innerText = "Time in " + place.name + " " + newYorkTime;
        resultDiv.appendChild(timeZone);

        // Description
        const description = document.createElement("p");
        description.classList.add("result-description");
        description.innerText = place.description;
        resultDiv.appendChild(description);

        const button = document.createElement("button");
        button.classList.add("result-button");
        button.innerText = "Visit";
        resultDiv.appendChild(button);

        // Append to search results container
        searchResults.appendChild(resultDiv);
      });

      // If no results, show a message
      if (results.length === 0) {
        const noResults = document.createElement("p");
        noResults.innerText = "No results found";
        searchResults.appendChild(noResults);
      }
    })
    .catch((error) => {
      console.error("Error:", error);
      searchResults.innerHTML = "An error occurred";
    });
}
