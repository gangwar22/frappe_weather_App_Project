
const cityInput = document.querySelector(".city-input");
const searchButton = document.querySelector(".search-btn");
const currentWeatherDiv = document.querySelector(".current-weather");
const weatherCardsDiv = document.querySelector(".weather-cards");
const API_KEY = "3f3a9ec87f18b0c1136f4da517785b1a"; // API key for OpenWeatherMap API

// Function to get city coordinates based on user input
const getCityCoordinates = () => {
    const cityName = cityInput.value.trim();
    if (cityName === "") return;

    const API_URL = `http://api.openweathermap.org/geo/1.0/direct?q=${cityName}&limit=1&appid=${API_KEY}`;

    fetch(API_URL)
        .then(response => response.json())
        .then(data => {
            if (!data.length) return alert(`No coordinates found for ${cityName}`);
            const { lat, lon } = data[0];
            getWeatherDetails(lat, lon);
        })
        .catch(() => {
            alert("An error occurred while fetching the coordinates!");
        });
}



// Function to get weather details based on coordinates
const getWeatherDetails = (lat, lon) => {
    const WEATHER_API_URL = `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&units=metric&appid=${API_KEY}`;

    fetch(WEATHER_API_URL)
        .then(response => response.json())
        .then(data => {
            displayWeatherDetails(data);
            saveLastSearch(data); // Save the data to local storage
            console.log("data fetch", data);
        })
        .catch(() => {
            alert("An error occurred while fetching the weather details!");
        });
}

// Function to display weather details
const displayWeatherDetails = (data) => {
    const { city, list } = data;
    const currentWeather = list[0];
    const currentWeatherHtml = `
        <h2>Current Weather in ${city.name}, ${city.country}</h2>
        <p>Temperature: ${currentWeather.main.temp} °C</p>
        <p>Weather: ${currentWeather.weather[0].description}</p>
        <img src="http://openweathermap.org/img/wn/${currentWeather.weather[0].icon}@2x.png" alt="Weather icon">
        <p>Wind: ${currentWeather.wind.speed} m/s</p>
        <p>Humidity: ${currentWeather.main.humidity} %</p>
    `;
    currentWeatherDiv.innerHTML = currentWeatherHtml;

    let forecastHtml = '';
    for (let i = 8; i < list.length; i += 8) {
        const day = list[i];
        const date = new Date(day.dt_txt);
        const formattedDate = date.toLocaleDateString('en-GB', {
            weekday: 'long', year: 'numeric', month: 'long', day: 'numeric'
        });

        forecastHtml += `
            <div class="card">
                <h3>${formattedDate}</h3>
                <p>Temp: ${day.main.temp} °C</p>
                <p>Weather: ${day.weather[0].description}</p>
                <img src="http://openweathermap.org/img/wn/${day.weather[0].icon}@2x.png" alt="Weather icon">
                <p>Wind: ${day.wind.speed} m/s</p>
                <p>Humidity: ${day.main.humidity} %</p>
            </div>
        `;
    }
    weatherCardsDiv.innerHTML = forecastHtml;
}

// Function to save the last search data to local storage
const saveLastSearch = (data) => {
    localStorage.setItem("lastWeatherData", JSON.stringify(data));
}

// Function to load the last search data from local storage
const loadLastSearch = () => {
    const lastWeatherData = localStorage.getItem("lastWeatherData");
    if (lastWeatherData) {
        const data = JSON.parse(lastWeatherData);
        displayWeatherDetails(data);
    }
}

// Event listeners
searchButton.addEventListener("click", getCityCoordinates);
cityInput.addEventListener("keyup", e => {
    if (e.key === "Enter") getCityCoordinates();
});

// Load the last search data when the page loads
window.addEventListener("load", loadLastSearch);
