const apiKey = "5acd042ddd6f4e080216a77f5c900219";

document.getElementById("search-btn").addEventListener("click", () => {
  const city = document.getElementById("search-input").value.trim();
  if (!city) return;

  getWeather(city);
});

async function getWeather(city) {
  try {
    const weatherRes = await fetch(
      `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`
    );
    const weatherData = await weatherRes.json();

    const { lat, lon } = weatherData.coord;

    displayCurrentWeather(weatherData);
    getForecast(city);
    getAQI(lat, lon);
  } catch (error) {
    alert("City not found or error fetching data");
  }
}

function displayCurrentWeather(data) {
  document.getElementById("current-city").textContent = data.name;
  document.getElementById("current-temp").textContent = `${data.main.temp}°C`;
  document.getElementById("weather-description").textContent = data.weather[0].description;
  document.getElementById("feels-like").textContent = `Feels like: ${data.main.feels_like}°C`;
  document.getElementById("humidity").textContent = `${data.main.humidity}%`;
  document.getElementById("wind-speed").textContent = `${data.wind.speed} km/h`;
  document.getElementById("pressure").textContent = `${data.main.pressure} hPa`;
  document.getElementById("sunrise").textContent = new Date(data.sys.sunrise * 1000).toLocaleTimeString();
  document.getElementById("sunset").textContent = new Date(data.sys.sunset * 1000).toLocaleTimeString();
  document.getElementById("visibility").textContent = `${data.visibility / 1000} km`;
  document.getElementById("clouds").textContent = `${data.clouds.all}%`;

  document.getElementById("current-weather-icon").src = `https://openweathermap.org/img/wn/${data.weather[0].icon}@2x.png`;
}

async function getForecast(city) {
  const res = await fetch(
    `https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${apiKey}&units=metric`
  );
  const data = await res.json();

  const hourlyHTML = data.list.slice(0, 6).map((item) => {
    return `
      <div class="hour-card">
        <p>${new Date(item.dt * 1000).getHours()}:00</p>
        <img src="https://openweathermap.org/img/wn/${item.weather[0].icon}@2x.png" width="50">
        <p>${item.main.temp}°C</p>
      </div>`;
  }).join("");

  document.getElementById("hourly-forecast").innerHTML = hourlyHTML;

  const days = {};
  data.list.forEach(item => {
    const date = item.dt_txt.split(" ")[0];
    if (!days[date]) days[date] = [];
    days[date].push(item);
  });

  const dailyHTML = Object.keys(days).slice(0, 5).map(date => {
    const dayData = days[date][0];
    return `
      <div class="day-card">
        <p>${new Date(date).toDateString()}</p>
        <img src="https://openweathermap.org/img/wn/${dayData.weather[0].icon}@2x.png" width="50">
        <p>${dayData.main.temp}°C</p>
      </div>`;
  }).join("");

  document.getElementById("daily-forecast").innerHTML = dailyHTML;
}

async function getAQI(lat, lon) {
  const res = await fetch(
    `https://api.openweathermap.org/data/2.5/air_pollution?lat=${lat}&lon=${lon}&appid=${apiKey}`
  );
  const data = await res.json();

  const aqi = data.list[0].main.aqi;

  document.getElementById("aqi-value").textContent = aqi;
  document.getElementById("aqi-bar").style.width = `${aqi * 20}%`;

  const descriptions = ["Good", "Fair", "Moderate", "Poor", "Very Poor"];
  document.getElementById("aqi-description").textContent = descriptions[aqi - 1];
}
