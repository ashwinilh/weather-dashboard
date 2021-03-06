//Declare a variable to store the searched city
var city = "";
// variable declaration
var searchCity = $("#search-city");
var clearButton = $("#clear-history");
var currentCity = $("#current-city");
var currentTemperature = $("#temperature");
var currentHumidty = $("#humidity");
var currentWSpeed = $("#wind-speed");
var currentUvindex = $("#uv-index");
var sCity = [];

// searches the city to see if it exists in the entries from the storage

function find(c) {
    for (var i = 0; i < sCity.length; i++) {
        if (c.toUpperCase() === sCity[i]) {
            return -1;
        }
    }
    return 1;
}
//Set up the API key
var APIKey = "c6079cfc6ca681783c9a78f441ac216e";

// Display the curent and future weather to the user after grabing the city form the input text box.
function displayWeather(event) {
    event.preventDefault();
    if (searchCity.val().trim() !== "") {
        city = searchCity.val().trim();
        currentWeather(city);
    }
}

//  create the AJAX call
function currentWeather(city) {
    //  build the URL to get a data from server side.
    var queryURL = "https://api.openweathermap.org/data/2.5/weather?q=" + city + "&APPID=" + APIKey;
    $.ajax({
        url: queryURL,
        method: "GET",
    }).then(function (response) {

        // parse the response to display the current weather including the City name, the Date and the weather icon. 
        console.log(response);
        //Data object from server side Api for icon property.
        var weatherIcon = response.weather[0].icon;
        var iconurl = "https://openweathermap.org/img/wn/" + weatherIcon + "@2x.png";
        // The date format method is taken from the  https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Date
        var date = new Date(response.dt * 1000).toLocaleDateString();
        //parse the response for name of city and concanatig the date and icon.
        $(currentCity).html(response.name + "(" + date + ")" + "<img src=" + iconurl + ">");
        // parse the response to display the current temperature.
        // Convert the temp to fahrenheit

        var tempF = (response.main.temp - 273.15) * 1.80 + 32;
        $(currentTemperature).html((tempF).toFixed(2) + "&#8457");
        // Display the Humidity
        $(currentHumidty).html(response.main.humidity + "%");
        //Display Wind speed and convert to MPH
        var ws = response.wind.speed;
        var windsmph = (ws * 2.237).toFixed(1);
        $(currentWSpeed).html(windsmph + "MPH");
        forecast(response.coord.lon, response.coord.lat);
        //local storage
        if (response.cod == 200) {
            sCity = JSON.parse(localStorage.getItem("cityname"));
            console.log(sCity);
            if (sCity == null) {
                sCity = [];
                sCity.push(city.toUpperCase()
                );
                localStorage.setItem("cityname", JSON.stringify(sCity));
                addToList(city);
            }
            else {
                if (find(city) > 0) {
                    sCity.push(city.toUpperCase());
                    localStorage.setItem("cityname", JSON.stringify(sCity));
                    addToList(city);
                }
            }
        }
    });
}


//  display the 5 days forecast for the current city.
function forecast(lon, lat) {

    var queryforcastURL = `https://api.openweathermap.org/data/2.5/onecall?lat=${lat}&lon=${lon}&exclude=hourly,minutely&units=imperial&appid=${APIKey}`


    $.ajax({
        url: queryforcastURL,
        method: "GET"
    }).then(function (response) {
        var currentUVIndexValue = response.current.uvi;
        $(currentUvindex).html(currentUVIndexValue);
        $(currentUvindex).removeClass('bg-warning bg-success bg-danger');
        if (currentUVIndexValue <= 2) {
            $(currentUvindex).addClass('bg-success');
        }
        else if(currentUVIndexValue > 2 && currentUVIndexValue <= 7){
            $(currentUvindex).addClass('bg-warning');
        }
        else {
            $(currentUvindex).addClass('bg-danger');
        }

        for (i = 0; i < 5; i++) {
            var date = new Date((response.daily[i].dt) * 1000).toLocaleDateString();
            var iconCode = response.daily[i].weather[0].icon;
            var iconUrl = "https://openweathermap.org/img/wn/" + iconCode + ".png";
            var tempF = response.daily[i].temp.max;
            var humidity = response.daily[i].humidity;
            var wind = response.daily[i].wind_speed + ' mph';

            $("#fDate" + i).html(date);
            $("#fImg" + i).html("<img src=" + iconUrl + ">");
            $("#wind" + i).html(wind);
            $("#fTemp" + i).html(tempF + "&#8457");
            $("#fHumidity" + i).html(humidity + "%");
        }

    });
}

//Daynamically add the passed city on the search history
function addToList(c) {
    var listEl = $("<li>" + c.toUpperCase() + "</li>");
    $(listEl).attr("class", "list-group-item");
    $(listEl).attr("data-value", c.toUpperCase());
    $(".list-group").append(listEl);
}
// display the past search again when the list group item is clicked in search history
function invokePastSearch(event) {
    var liEl = event.target;
    if (event.target.matches("li")) {
        city = liEl.textContent.trim();
        currentWeather(city);
    }

}

// render function
function loadlastCity() {
    $("ul").empty();
    var sCity = JSON.parse(localStorage.getItem("cityname"));
    if (sCity !== null) {
        sCity = JSON.parse(localStorage.getItem("cityname"));
        for (i = 0; i < sCity.length; i++) {
            addToList(sCity[i]);
        }
        city = sCity[i - 1];
        currentWeather(city);
    }

}
//Clear the search history from the page
function clearHistory(event) {
    event.preventDefault();
    sCity = [];
    localStorage.removeItem("cityname");
    document.location.reload();

}
//Click Handlers
$("#search-button").on("click", displayWeather);
$(document).on("click", invokePastSearch);
$(window).on("load", loadlastCity);
$("#clear-history").on("click", clearHistory);

