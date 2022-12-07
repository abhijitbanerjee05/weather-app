const currentLocationForm = document.getElementById("location-form");
const currentLocation = document.querySelector(".location");
const currentTemperature = document.querySelector(".temperature");
const currentWeatherDescription = document.querySelector(".weather-desription");
const currentWind = document.getElementById("current-wind");
const currenthumidity = document.getElementById("current-humidity");
const currentPressure = document.getElementById("current-pressure");
const weatherForecastContainer = document.querySelector(
  ".weather-forecast-container"
);

const getYahooWeather = async (currentLocation) => {
  const options = {
    method: "GET",
    headers: {
      "X-RapidAPI-Key": "b1a4c66d64msh507722c4cd3fce9p1e42a6jsn8fce9d32e569",
      "X-RapidAPI-Host": "yahoo-weather5.p.rapidapi.com",
    },
  };
  const fetchWeather = await fetch(
    `https://yahoo-weather5.p.rapidapi.com/weather?location=${currentLocation}&format=json&u=c`,
    options
  );
  const fetchWeatherJson = await fetchWeather.json();
  return fetchWeatherJson;
};

const setCurrentWeatherParameters = (fetchWeather) => {
  currentTemperature.innerText = fetchWeather["condition"]["temperature"];
  currentWeatherDescription.innerText = fetchWeather["condition"]["text"];
  currentWind.innerText = fetchWeather["wind"]["speed"];
  currenthumidity.innerText = fetchWeather["atmosphere"]["humidity"];
  currentPressure.innerText = fetchWeather["atmosphere"]["pressure"];
};

const createForecastElement = (forecast) => {
  const forecastElement = document.createElement("div");
  forecastElement.classList.add("weather-forecast-per-day");

  //creating day and date element
  const dayAndDate = document.createElement("h4");
  dayAndDate.classList.add("day-and-date");
  let date = new Date(forecast.date);
  dayAndDate.appendChild(
    document.createTextNode(`${forecast.day} ${date.getDay()}`)
  );
  forecastElement.appendChild(dayAndDate);

  //creating forecast temperature elements
  const forecastTempContainer = document.createElement("div");
  forecastTempContainer.classList.add("forecast-temperature-container");

  const forecastTemphigh = document.createElement("h2");
  forecastTemphigh.classList.add("forecast-temperature-high");
  forecastTemphigh.appendChild(document.createTextNode(forecast.high + "°"));
  forecastTempContainer.appendChild(forecastTemphigh);
  forecastElement.appendChild(forecastTempContainer);

  const forecastTemplow = document.createElement("h2");
  forecastTemplow.classList.add("forecast-temperature-low");
  forecastTemplow.appendChild(document.createTextNode(forecast.low + "°"));
  forecastTempContainer.appendChild(forecastTemplow);
  forecastElement.appendChild(forecastTempContainer);

  //creating forecast description element
  const forecastDescription = document.createElement("h4");
  forecastDescription.classList.add("forecast-weather-desription");
  forecastDescription.appendChild(document.createTextNode(forecast.text));

  forecastElement.appendChild(forecastDescription);

  return forecastElement;
};

const setForcastWeatherParameters = (forecastData) => {
  //removing all previous elements
  while (weatherForecastContainer.firstChild) {
    weatherForecastContainer.removeChild(weatherForecastContainer.firstChild);
  }
  //adding forecast elements starting from the next day
  forecastData.slice(1, forecastData.length).forEach((forecast) => {
    const forecastElement = createForecastElement(forecast);
    weatherForecastContainer.appendChild(forecastElement);
  });
};

const runWeatherApp = async () => {
  try {
    const fetchWeather = await getYahooWeather(currentLocation.value);
    setCurrentWeatherParameters(fetchWeather["current_observation"]);
    setForcastWeatherParameters(fetchWeather.forecasts);
  } catch (error) {
    console.log("No data found.");
  }
};

currentLocationForm.addEventListener("click", (event) => {
  event.preventDefault();
});

runWeatherApp();

currentLocation.addEventListener("keypress", (event) => {
  if (event.key == "Enter") {
    event.preventDefault();
    runWeatherApp();
  }
});
