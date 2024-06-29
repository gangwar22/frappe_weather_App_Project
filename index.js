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

