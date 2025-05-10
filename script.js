let btn = document.querySelector(".btn");
let cityName = document.querySelector("#cityName");
let temperature = document.querySelector("#temperature");
let feelsLike = document.querySelector("#feelsLike");
let humidity = document.querySelector("#humidity");
let lon = document.querySelector("#lon");
let lat = document.querySelector("#lat");
let description = document.querySelector("#description");
let weatherIcon = document.querySelector("#weatherIcon");

async function getWeather(event) {
  event.preventDefault();
  let city = document.querySelector("#city").value;

  const apiKey = `11efeb0579bec011f50442a3abb6b746`;
  const apiUrl = `https://api.openweathermap.org/data/2.5/weather?q=${city}&lang=en&units=metric&appid=${apiKey}`;

  var response = await fetch(apiUrl);
  var data = await response.json();
  console.log(data);

  cityName.innerText = data.name;
  temperature.innerText = `${data.main.temp}°C`;
  feelsLike.innerText = `${data.main.feels_like}`;
  humidity.innerHTML = `${data.main.humidity}%`;
  lon.innerText = `${data.coord.lon}`;
  lat.innerText = `${data.coord.lat}`;
  description.innerText = `${data.weather[0].description}`
  weatherIcon.src = weatherIcon.src = `https://openweathermap.org/img/wn/${data.weather[0].icon}@2x.png`;

}

btn.addEventListener("click", getWeather);

// getWeather();
