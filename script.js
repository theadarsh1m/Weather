let btn = document.querySelector(".btn");
let cityName = document.querySelector("#cityName");
let temperature = document.querySelector("#temperature");
let feelsLike = document.querySelector("#feelsLike");
let humidity = document.querySelector("#humidity");
let lon = document.querySelector("#lon");
let lat = document.querySelector("#lat");
let description = document.querySelector("#description");
let weatherIcon = document.querySelector("#weatherIcon");

const unsplashApiKey = "qDyNBAbAgWAA4Bd59Kup_bOQMNAJODQHNAvt_YelOHE";
const weatherApiKey = `11efeb0579bec011f50442a3abb6b746`;

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

  await getPic(city);
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

  console.log(data);
}

btn.addEventListener("click", (event) => {
  event.preventDefault();
  let city = document.querySelector("#city").value;
  getWeatherByCity(city);
});

window.onload = getUserCoordinates();
