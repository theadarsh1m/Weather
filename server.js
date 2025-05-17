const express = require("express");
const fetch = require("node-fetch"); // For calling external APIs
require("dotenv").config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.static("public"));

app.get("/api/weather", async (req, res) => {
  const city = req.query.city;
  const lat = req.query.lat;
  const lon = req.query.lon;
  const apiKey = process.env.WEATHER_API_KEY;

  let url;

  // Handle query by city or coordinates
  if (city) {
    url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`;
  } else if (lat && lon) {
    url = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${apiKey}&units=metric`;
  } else {
    return res.status(400).json({ error: "City or coordinates required" });
  }

  try {
    const response = await fetch(url);
    const data = await response.json();
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch weather" });
  }
});

app.get("/api/unsplash", async (req, res) => {
  const city = req.query.city;
  const apiKey = process.env.UNSPLASH_API_KEY;

  const url = `https://api.unsplash.com/search/photos?query=${city}&client_id=${apiKey}`;

  try {
    const response = await fetch(url);
    const data = await response.json();
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch image" });
  }
});

app.get("/api/location", async (req, res) => {
  const query = req.query.q;
  const apiKey = process.env.LOCATIONIQ_API_KEY;

  const url = `https://api.locationiq.com/v1/autocomplete?key=${apiKey}&q=${query}&limit=5`;

  try {
    const response = await fetch(url);
    const data = await response.json();
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch city suggestions" });
  }
});

app.get("/api/aqi", async (req, res) => {
  const { lat, lon } = req.query;
  const apiKey = process.env.WEATHER_API_KEY;

  if (!lat || !lon) {
    return res.status(400).json({ error: "Latitude and longitude required" });
  }

  const url = `https://api.openweathermap.org/data/2.5/air_pollution?lat=${lat}&lon=${lon}&appid=${apiKey}`;

  try {
    const response = await fetch(url);
    const data = await response.json();
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch AQI" });
  }
});

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
