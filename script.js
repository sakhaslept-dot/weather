const input = document.getElementById("cityInput");
const button = document.getElementById("searchBtn");
const result = document.getElementById("result");

button.addEventListener("click", async function () {
 const city = input.value.trim();
 if (city === "") {
    result.innerHTML = "Введите город";
    return;
 }
 result.innerHTML = "Загрузка...";
 const geoResponse = await fetch(
    `https://geocoding-api.open-meteo.com/v1/search?name=${city}&count=1&language=ru&format=json`
    );
    const geoData = await geoResponse.json();
    if (!geoData.results) {
        result.innerHTML = "Город не найден";
        return;
    }
    const lat = geoData.results[0].latitude;
    const lon = geoData.results[0].longitude;
    const name = geoData.results[0].name;
    const country = geoData.results[0].country;
    
    const weatherResponse = await fetch(
        `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current=temperature_2m,wind_speed_10m&hourly=relative_humidity_2m&timezone=auto`

     );

    const weatherData = await weatherResponse.json();
    result.innerHTML = `
        <div class="card">
            <h2>${name}, ${country}</h2>
            <p>Температура: ${weatherData.current.temperature_2m}°C</p>
            <p>Ветер: ${weatherData.current.wind_speed_10m}км/ч</p>
            <p>Влажность: ${weatherData.hourly.relative_humidity_2m[0]}</p>
            <p>Широта: ${lat}</p>
            <p>Долгота: ${lon}</p>
            <p>Часть света: ${weatherData.timezone}</p>
        </div>
    `;
})