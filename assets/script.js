const timeEl = document.getElementById('time');
const dateEl = document.getElementById('date');
const currentWeatherItemsEl = document.getElementById('current-weather-items');
const timeZoneEl = document.getElementById('time-zone');
const countryEl = document.getElementById('country');
const weatherForecastEl = document.getElementById('weather-forecast');
const currentTempEl = document.getElementById('current-temp');

const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']
const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

const API_kEY = 'c6079cfc6ca681783c9a78f441ac216e';


setInterval(() => {
    const time = new Date();
    const month = time.getMonth();
    const date = time.getDate();
    const day = time.getDay();
    const hour = time.getHours();
    const hoursIn12HrFormat = hour >= 13 ? hour % 12 : hour
    const minutes = time.getMinutes();
    const ampm = hour >= 12 ? 'PM' : 'AM'

    timeEl.innerHTML = hoursIn12HrFormat + ':' + minutes + ' ' + `<span id="am-pm">${ampm}</span>`

    dateEl.innerHTML = days[day] + ',' + date + ' ' + months[month]
}, 1000);
getWeatherData()
function getWeatherData() {
    navigator.geolocation.getCurrentPosition((success) => {
        let { latitude, longitude } = success.coords;

        fetch(`https://api.openweathermap.org/data/2.5/onecall?lat=${latitude}&lon=${longitude}&exclude=hourly,minutely&units=imperial&appid=${API_kEY}`).then(res => res.json()).then(data => {
            console.log(data)
            showWeatherData(data);
        })
    })

}
function showWeatherData(data) {
    let { humidity, wind_speed, temp, uvi } = data.current;


    currentWeatherItemsEl.innerHTML =
        `<div class="weather-item">
                        <div>Humidity</div>
                        <div>${humidity}</div>
                    </div>
                    <div class="weather-item">
                        <div>Wind Speed </div>
                        <div>${wind_speed}</div>
                    </div>
                    <div class="weather-item">
                        <div>Temperature</div>
                        <div>${temp}</div>
                    </div>
                    <div class="weather-item">
                        <div>UV Index</div>
                        <div>${uvi}</div>
                    </div>`;
    let otherDayForecast = '';
    data.daily.forEach((day, idx) => {
        if (idx == 0) {
            

        } else {
            otherDayForecast +=`
            <div class="weather-forecast-item">
                <div class="day">${window.moment(day.dt*1000).format('ddd')}
                <div class="day">Tuesday</div>
                <img src=" http://openweathermap.org/img/wn/${day.weather[0].icon}@2x.png" alt="weather icon" class="w-icon">
                <div class="temp">Temperature - ${day.temp}&#176; F</div>
                <div class="humidity">Humidity - ${day.humidity} %</div>
                <div class="wind-speed">Wind Speed - ${day.wind_speed} MPH</div>

            </div>
            
            
            
            
            `

        }
    })
    weatherForecastEl.innerHTML = otherDayForecast;
}