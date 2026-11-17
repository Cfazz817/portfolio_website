const weatherContainer = document.getElementById("weather-container");
const currentConditions = document.getElementById("current-conditions");
const apiUrl = "https://api.open-meteo.com/v1/forecast?latitude=40.7128&longitude=-74.0060&current=temperature_2m,weather_code&daily=temperature_2m_max,temperature_2m_min,wind_speed_10m_max,weather_code&temperature_unit=fahrenheit&wind_speed_unit=mph&timezone=auto";

function getCondition(code) {
    if (code >= 0 && code <= 1) {
        return { label: "Sunny", icon: "sunny-icon.png", photo: "sunny.jpg" };
    } else if (code >= 2 && code <= 3) {
        return { label: "Cloudy", icon: "clouds-icon.png", photo: "cloudy.jpg" };
    } else if (code >= 40 && code <= 49) {
        return { label: "Fog", icon: "fog-icon.png", photo: "fog.jpg" };
    } else if (code >= 50 && code <= 69) {
        return { label: "Rain", icon: "rain-icon.png", photo: "rain.jpg" };
    } else if (code >= 70 && code <= 79) {
        return { label: "Snow", icon: "snow-icon.png", photo: "snow.jpg" };
    } else if (code >= 80 && code <= 84) {
        return { label: "Showers", icon: "rain-icon.png", photo: "rain.jpg" };
    } else if (code >= 85 && code <= 86) {
        return { label: "Snow showers", icon: "snow-icon.png", photo: "snow.jpg" };
    } else if (code >= 95 && code <= 99) {
        return { label: "Thunderstorm", icon: "storm-icon.png", photo: "storm.jpg" };
    }

    // Only runs if no range above matched
    return { label: "Cloudy", icon: "clouds-icon.png", photo: "clouds.jpg" };
}

function getWinds(speed) {
    let iconName;

    if (speed < 10) {
        iconName = "light.png";
    } else if (speed < 20) {
        iconName = "moderate.png";
    } else if (speed < 40) {
        iconName = "strong.png";
    } else {
        iconName = "verystrong.png"; // 40 and over
    }

    return iconName;
}

fetch(apiUrl)
    .then(response => response.json())
    .then(data => {
        const currentTemp = data.current.temperature_2m;
        const currentCode = data.current.weather_code;
        const currentCondition = getCondition(currentCode);
        const maxWinds = data.daily.wind_speed_10m_max;

        // Change the hero background photo based on current conditions
        const heroSection = document.getElementById("hero");
        heroSection.style.backgroundImage = "url('../images/" + currentCondition.photo + "')";

        const nowHeading = document.createElement("h2");
        nowHeading.textContent = "Current conditions";

        const currentIcon = document.createElement("img");
        currentIcon.src = "../assets/" + currentCondition.icon;
        currentIcon.alt = currentCondition.label;
        currentIcon.classList.add("current-icon");

        const currentTempText = document.createElement("p");
        currentTempText.textContent = Math.round(currentTemp) + "°F";
        currentTempText.classList.add("current-temp");

        const currentLabel = document.createElement("p");
        currentLabel.textContent = currentCondition.label;
        currentLabel.classList.add("current-label");

        const todayWind = document.createElement("p");
        todayWind.textContent = "Max wind today: " + maxWinds[0] + " mph";

        currentConditions.appendChild(nowHeading);
        currentConditions.appendChild(currentIcon);
        currentConditions.appendChild(currentTempText);
        currentConditions.appendChild(currentLabel);
        currentConditions.appendChild(todayWind);

        const dates = data.daily.time;
        const maxTemps = data.daily.temperature_2m_max;
        const minTemps = data.daily.temperature_2m_min;

        for (let i = 0; i < dates.length; i++) {
            const card = document.createElement("div");
            card.classList.add("card");

            const date = document.createElement("h2");
            date.textContent = dates[i];

            const condition = document.createElement("img");
            const conditionData = getCondition(data.daily.weather_code[i]);
            condition.src = "../assets/" + conditionData.icon;
            condition.alt = conditionData.label;

            const maxTemp = document.createElement("p");
            maxTemp.textContent = "High: " + maxTemps[i] + "°F";

            const minTemp = document.createElement("p");
            minTemp.textContent = "Low: " + minTemps[i] + "°F";

            // 1. Create the Max wind line 
            const dailyWind = document.createElement("p");
            dailyWind.textContent = "Max wind: " + maxWinds[i] + " mph";

            // 2. Create the wind icon image element
            const windIcon = document.createElement("img");
            const windIconFile = getWinds(maxWinds[i]);

            windIcon.src = "../assets/" + windIconFile;
            windIcon.alt = "Wind speed icon";
            windIcon.classList.add("wind-icon");

            card.appendChild(date);
            card.appendChild(maxTemp);
            card.appendChild(minTemp);
            card.appendChild(condition);
            card.appendChild(dailyWind);
            card.appendChild(windIcon);

            weatherContainer.appendChild(card);
        }
    })
    .catch(error => {
        weatherContainer.innerHTML = "<p>Sorry, weather data could not be loaded.</p>";
        console.error("Error fetching weather data:", error);
    });

