let btn = document.querySelector(".btn");
let cityName = document.querySelector("#cityName");
let temperature = document.querySelector("#temperature");
let feelsLike = document.querySelector("#feelsLike");
let humidity = document.querySelector("#humidity");
let lon = document.querySelector("#lon");
let lat = document.querySelector("#lat");
let description = document.querySelector("#description");
let weatherIcon = document.querySelector("#weatherIcon");
let tempToggle = document.querySelector("#tempToggle");
const cityInput = document.querySelector("#city");
const suggestionsList = document.querySelector("#suggestions");

let isCelsius = true;

const unsplashApiKey = "qDyNBAbAgWAA4Bd59Kup_bOQMNAJODQHNAvt_YelOHE";
const weatherApiKey = `11efeb0579bec011f50442a3abb6b746`;
const locationIqApiKey = `pk.970ddc983240310cf27c31e25aed4b04`;

async function getWeatherByCity(city) {
  const apiUrl = `https://api.openweathermap.org/data/2.5/weather?q=${city}&lang=en&units=metric&appid=${weatherApiKey}`;
  return await getWeather(apiUrl);
}

async function getWeatherByCoordinates(lat, lon) {
  const apiUrl = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&lang=en&units=metric&appid=${weatherApiKey}`;
  return await getWeather(apiUrl);
}

async function getWeather(apiUrl) {
  var response = await fetch(apiUrl);
  var data = await response.json();
  let city = document.querySelector("#city").value;
  isCelsius = true;

  if (data.cod != 200) {
    document.querySelector("#errorMessage").innerText =
      "Enter a valid city name";
    document.querySelector("#errorMessage").style.display = "block";
    return;
  }
  document.querySelector("#errorMessage").style.display = "none";
  //   console.log(data);

  cityName.innerText = data.name;
  temperature.innerText = `${data.main.temp}°C`;
  feelsLike.innerText = `${data.main.feels_like}`;
  humidity.innerHTML = `${data.main.humidity}%`;
  lon.innerText = `${data.coord.lon}`;
  lat.innerText = `${data.coord.lat}`;
  description.innerText = `${data.weather[0].description}`;
  weatherIcon.src =
    weatherIcon.src = `https://openweathermap.org/img/wn/${data.weather[0].icon}@2x.png`;

  await getAQI(data.coord.lat, data.coord.lon);
  await getPic(city);
}

async function getAQI(lat, lon) {
  const aqiApiUrl = `https://api.openweathermap.org/data/2.5/air_pollution?lat=${lat}&lon=${lon}&appid=${weatherApiKey}`;

  const response = await fetch(aqiApiUrl);
  const data = await response.json();

  const aqiRating = getAQIRating(data.list[0].main.aqi);
  document.querySelector("#aqi").innerText = aqiRating;
  // console.log(data);
}

function getAQIRating(aqi) {
  switch (aqi) {
    case 1:
      return "Good";
    case 2:
      return "Fair";
    case 3:
      return "Moderate";
    case 4:
      return "Poor";
    case 5:
      return "Very Poor";
    default:
      return "Unknown";
  }
}

async function getUserCoordinates() {
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(
      async function (position) {
        const latitude = position.coords.latitude;
        const longitude = position.coords.longitude;
        // console.log("Latitude:", latitude);
        // console.log("Longitude:", longitude);
        await getWeatherByCoordinates(latitude, longitude);
      },
      async function (error) {
        console.error("Error getting location:", error.message);
      }
    );
  } else {
    console.log("Geolocation is not supported by this browser.");
  }
}

async function getPic(city) {
  const picUrl = `https://api.unsplash.com/search/photos?query=${city}&client_id=${unsplashApiKey}`;

  const response = await fetch(picUrl);
  const data = await response.json();

  if (data.results.length > 0) {
    const randomIndex = Math.floor(Math.random() * data.results.length);
    const imgUrl = data.results[randomIndex].urls.regular;
    document.querySelector(
      ".weather-bg"
    ).style.backgroundImage = `url(${imgUrl})`;
  }

  // console.log(data);
}

async function getCitySuggestions(query) {
  const apiUrl = `https://api.locationiq.com/v1/autocomplete?key=${locationIqApiKey}&q=${query}&limit=5&dedupe=1&`;
  const response = await fetch(apiUrl);
  const data = await response.json();
  return data || [];
}

btn.addEventListener("click", (event) => {
  event.preventDefault();
  let city = document.querySelector("#city").value;
  getWeatherByCity(city);
  suggestionsList.style.display = "none";
});

function updateTemperature(currentTemp) {
  if (isCelsius) {
    isCelsius = !isCelsius;
    const tempInFahrenheit = (currentTemp * 9) / 5 + 32;
    temperature.innerText = `${tempInFahrenheit.toFixed(2)}°F`;
    tempToggle.innerText = "Switch to °C";
  } else {
    isCelsius = !isCelsius;
    const tempInCelsius = ((currentTemp - 32) * 5) / 9;
    temperature.innerText = `${tempInCelsius.toFixed(2)}°C`;
    tempToggle.innerText = "Switch to °F";
  }
}

function displaySuggestions(suggestions) {
  suggestionsList.innerHTML = "";
  if (suggestions.length == 0) {
    suggestionsList.style.display = "none";
    return;
  }

  const threeSuggestions = suggestions.slice(0, 3);
  threeSuggestions.forEach((suggestion) => {
    const li = document.createElement("li");
    li.className = "list-group-item list-group-item-action";
    li.style.padding = "0.25rem 0.5rem";
    li.textContent = suggestion.display_name.split(",")[0];
    li.addEventListener("click", () => {
      cityInput.value = suggestion.display_name.split(",")[0];
      suggestionsList.style.display = "none";
    });
    suggestionsList.appendChild(li);
  });
  suggestionsList.style.display = "block";
}

tempToggle.addEventListener("click", () => {
  // isCelsius = !isCelsius;
  let currentTemp = parseFloat(temperature.innerText);
  updateTemperature(currentTemp);
});

cityInput.addEventListener("input", async () => {
  let query = cityInput.value;
  if (query === "") {
    suggestionsList.style.display = "none";
    return;
  }
  const suggestions = await getCitySuggestions(query);
  displaySuggestions(suggestions);
});

window.onload = getUserCoordinates();
