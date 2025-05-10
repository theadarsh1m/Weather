let city = document.querySelector("#city").value;
let btn = document.querySelector(".btn");
let cityName = document.querySelector(".cityName");




async function getWeather() {
    const apiKey = `11efeb0579bec011f50442a3abb6b746`;
    const apiUrl = `https://api.openweathermap.org/data/2.5/weather?q=${city}&lang=en&units=metric&appid=${apiKey}`;
    var response = await fetch(apiUrl);
    var data = await response.json();
    console.log(data);

    console.log(data.main.temp);
    cityName.innerText = city;

}

btn.addEventListener('click' , getWeather);

// getWeather();

