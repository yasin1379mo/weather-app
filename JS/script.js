const apiKey = "8ece84602422d3864e36ec004f03f6bc";
const apiUrl = "https://api.openweathermap.org/data/2.5/weather?units=metric&q=";
const searchBox = document.querySelector(".search input");
const searchBtn = document.querySelector(".search button");
const weatherIcon = document.querySelector(".weather-icon");
const autocompleteElement = document.querySelector("#autocomplete");
const cityGuessElements = document.querySelectorAll(".city-guess");

const dayBtn = document.getElementById("dayBtn");
const hourBtn = document.getElementById("hourBtn");
const dailyForecast = document.querySelector(".daily-forecast");
const hourlyForecast = document.querySelector(".hourly-forecast");

searchBtn.addEventListener("click", handleSearch);
dayBtn.addEventListener("click", displayDailyForecast);
hourBtn.addEventListener("click", displayHourlyForecast);
searchBox.addEventListener("input", handleSearchBoxInput);

function handleSearch() {
  getWeather(searchBox.value);
  autocompleteElement.style.display = "none";
  document.querySelector(".weather-load").style.display = "block";
}

function displayDailyForecast() {
  dailyForecast.style.display = "flex";
  hourlyForecast.style.display = "none";
}

function displayHourlyForecast() {
  hourlyForecast.style.display = "flex";
  dailyForecast.style.display = "none";
}

async function getWeather(city) {
  const weatherResponse = await fetch(apiUrl + city + `&appid=${apiKey}`);
  if (weatherResponse.status === 404) {
    handleWeatherError();
  } else {
    const data = await weatherResponse.json();
    updateWeatherData(data);
    const { lat, lon } = data.coord;
    const forecastApiUrl = `http://api.weatherunlocked.com/api/forecast/${lat},${lon}?`;
    const forecastApiKey = `app_id=6fb97d13&app_key=91ddfdcf5e0382772c69bff3d7035f0e`;
    try {
      const forecastResponse = await fetch(forecastApiUrl + forecastApiKey);
      const forecastData = await forecastResponse.json();
      updateForecastData(forecastData);
      handleForecastDisplay();
    } catch (error) {
      handleForecastError();
    }
  }
}

function handleWeatherError() {
  document.querySelector(".error").style.display = "block";
  dayBtn.style.display = "none";
  hourBtn.style.display = "none";
  hourlyForecast.style.display = "none";
  dailyForecast.style.display = "none";
  document.querySelector(".weather").style.display = "none";
}

function updateWeatherData(data) {
  document.querySelector(".city").innerHTML = `${data.name}, ${data.sys.country}`;
  document.querySelector(".temp").innerHTML = `${Math.round(data.main.temp)}°C`;
  document.querySelector(".humidity").innerHTML = `${data.main.humidity}%`;
  document.querySelector(".wind").innerHTML = `${data.wind.speed}km/h`;
  const weatherIcons = {
    Clouds: "pics/clouds.png",
    Clear: "pics/clear.png",
    Rain: "pics/rain.png",
    Drizzle: "pics/drizzle.png",
    Mist: "pics/mist.png",
    Snow: "pics/snow.png",
  };
  const weatherMain = data.weather[0].main;
  weatherIcon.src = weatherIcons[weatherMain] || "default-icon.png";
  console.log(data);
  document.querySelector(".weather-load").style.display = "none";
  document.querySelector(".loading-con").style.display = "inline-block";
  document.querySelector(".weather").style.display = "block";
  document.querySelector(".error").style.display = "none";
}

function updateForecastData(data) {
  const dayIcons = [];
  const hourIcons = [];

  // Daily forecast section
  const dailyForecastContainer = document.querySelector(".daily-forecast");
  dailyForecastContainer.innerHTML = ""; // Clear existing cards
  for (let i = 0; i < data.Days.length; i++) {
    dayIcons[i] = data.Days[i].Timeframes[0].wx_code;

    const cardElement = document.createElement("div");
    cardElement.classList.add("card");
    cardElement.innerHTML = `
      <img src="pics/New folder/${dayIcons[i]}.png" class="forecastImgs" id="day-img${i}"/><br/>
      <div class="day" id="card${i}-day">${data.Days[i].date}</div>
      <div id="card${i}-temp">${data.Days[i].temp_min_c}&deg; | ${data.Days[i].temp_max_c}&deg;</div>
    `;
    dailyForecastContainer.appendChild(cardElement);
  }

  // Hourly forecast section
  const hourlyForecastContainer = document.querySelector(".hourly-forecast");
  hourlyForecastContainer.innerHTML = ""; // Clear existing cards
  for (let i = 0; i < data.Days[0].Timeframes.length; i++) {
    hourIcons[i] = data.Days[0].Timeframes[i].wx_code;

    const cardElement = document.createElement("div");
    cardElement.classList.add("card");
    cardElement.innerHTML = `
      <img src="pics/New folder/${hourIcons[i]}.png" class="forecastImgs" id="hour-img${i}"/><br/>
      <div class="day">${data.Days[0].Timeframes[i].time}</div>
      <div id="card${i}-temp-hour">${data.Days[0].Timeframes[i].temp_c}&deg;</div>
    `;
    hourlyForecastContainer.appendChild(cardElement);
  }
}

function handleForecastDisplay() {
  dayBtn.style.display = "inline";
  hourBtn.style.display = "inline";
  document.querySelector(".loading-con").style.display = "none";
}

function handleForecastError() {
  document.querySelector(".errorForecast").style.display = "flex";
}

async function getAutocomplete(searchValue) {
  if (searchValue.length < 3) {
    autocompleteElement.style.display = "none";
    return;
  }

  try {
    const autoCompleteResponse = await fetch(`https://api.teleport.org/api/cities/?search=${searchValue}&limit=3`);
    const data = await autoCompleteResponse.json();
    console.log(data);

    const searchResults = data._embedded["city:search-results"];

    cityGuessElements.forEach((guessElement, index) => {
      const matchingFullName = searchResults[index].matching_full_name;
      const guess = matchingFullName.split(",")[0];
      guessElement.innerHTML = matchingFullName;
      guessElement.addEventListener("click", () => {
        autocompleteElement.style.display = "none";
        searchBox.value = guess;
      });
    });

    autocompleteElement.style.display = "inline-block";
  } catch (error) {
    console.error(error);
  }
}

function handleSearchBoxInput() {
  getAutocomplete(searchBox.value);
  dayBtn.style.display = "none";
  hourBtn.style.display = "none";
  hourlyForecast.style.display = "none";
  dailyForecast.style.display = "none";
  document.querySelector(".errorForecast").style.display = "none";
  document.querySelector(".weather").style.display = "none";
}

function changeBg() {
  const images = [
    "url(pics/1.jpg)",
    "url(pics/2.jpg)",
    "url(pics/3.jpg)",
    "url(pics/4.jpg)",
    "url(pics/5.jpg)",
    "url(pics/6.jpg)",
    "url(pics/7.jpg)",
    "url(pics/8.jpg)",
    "url(pics/9.jpg)",
    "url(pics/10.jpg)",
  ];
  const body = document.querySelector("body");
  let bgIndex = Math.floor(Math.random() * images.length);
  body.style.backgroundImage = images[bgIndex];
}

setInterval(changeBg, 10000);
