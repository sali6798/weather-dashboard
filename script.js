$(document).ready(function() {
    var searchArr = [];

    // retrieves the UV value and displays whether it's a favorable, moderate or severe value
    function getCurrentUV(lat, long) {
        var queryURL = "https://api.openweathermap.org/data/2.5/uvi?appid=f795d0f35cc4e1a3c16dc76565d1114a&lat=" + lat + "&lon=" + long;
        var uvP = "";
        // retrieves data from the openweather API for 5 day forecast
        $.ajax({
            url: queryURL,
            method: "GET"
        }).then(function(response) {
            var uvVal = response.value;
            // create new p tag for the UV info label
            uvP = $("<p>");
            uvP.text("UV Index: ");
            
           // create new span the hods the UV value
            var uvSpan = $("<span>");
            uvSpan.text(uvVal);
            // append span to p tag
            uvP.append(uvSpan);
            // adds class to span depending if the UV value is 
            // favorable, moderate or severe based on information from 
            // https://www.who.int/uv/intersunprogramme/activities/uv_index/en/index1.html
            if (uvVal <= 2) {
                uvSpan.addClass("favorable");
            }
            else if (uvVal >= 8) {
                uvSpan.addClass("severe");
            }
            else {
                uvSpan.addClass("moderate");
            }
            // append UV info to current-forecast div
            $(".current-forecast").append(uvP);
        });
    }
    
    // displays all the information for the current forecast
    function displayCurrentForecast(city) {
        // get url with the city wanted
        var queryURL = "https://api.openweathermap.org/data/2.5/weather?q=" + city + "&appid=f795d0f35cc4e1a3c16dc76565d1114a&units=imperial";
        // retrieve the data from the API
        $.ajax({
            url: queryURL,
            method: "GET"
        }).then(function(response) {
            var currentForecastCard = $(".current-forecast");
            // clear all elements from the current-forecast div
            currentForecastCard.empty();
            
            // create a new h2 element
            var titleH2 = $("<h2>");
            // creates a new date object from the unix time given in the response
            // and returns a string in the format m/dd/yyyy set to local timezone
            var date = new Date(response.dt * 1000).toLocaleDateString("en-US");
            // sets the city name and date as the h2 text
            titleH2.text(response.name + ` (${date}) `);
            
            // create an img element and set the src as the icon value from the response
            // and set the alt attribute, then append the img to the h2 element
            var icon = $("<img>")
            icon.attr("src", `https://openweathermap.org/img/wn/${response.weather[0].icon}@2x.png`);
            icon.attr("alt", "weather icon");
            titleH2.append(icon);

            // create p elements for temp in farenheit, humidity and wind, and set their texts with their
            // values from the response
            var temp = $("<p>").text(`Temperature: ${response.main.temp}\xB0F`);
            var humidity = $("<p>").text(`Humidity: ${response.main.humidity}%`);
            var wind = $("<p>").text(`Wind Speed: ${response.wind.speed} MPH`);
            
            // append all new elements to the current-forecast div
            currentForecastCard.append(titleH2, temp, humidity, wind);
            
            var lat = response.coord.lat;
            var long = response.coord.lon;
            getCurrentUV(lat, long);
        }); 
    }
    
    // display 5 day forecast
    function displayDailyForecast(city) {
        var queryURL =  "http://api.openweathermap.org/data/2.5/forecast?q=" + city + "&appid=f795d0f35cc4e1a3c16dc76565d1114a&units=imperial";
        $.ajax({
            url: queryURL,
            method: "GET"
            // response returns an array size of 40 because there's a forecast for every 3 hours
        }).then(function(response) {
            // pos in the response.list array starts from the next time forecast that is 3 hours before index 0 
            // i.e. if response.list[0]'s time is 00:00:00, pos will start at response.list[7] which time will be
            // 21:00:00 and then every 24 hours from then, if response.list[0]'s time is 18:00:00, pos will start
            // at response.list[7] which will be 15:00:00
            var pos = 7;
            // loops through the five cards with class 'daily' 
            $(".daily").each(function(i, element) {
                // clears the div/card of all previous content
                $(element).empty();
                var forecast = response.list[pos];
                // create h5 element set text to date string from unix time set to local timezone
                var date = $("<h5>").text(new Date(forecast.dt * 1000).toLocaleDateString("en-US"));
                // create img element with the weather icon
                var icon = $(`<img src="http://openweathermap.org/img/wn/${forecast.weather[0].icon}@2x.png" alt="weather icon">`);
                // create a small element for the weather description
                var desc = $("<small>").text(forecast.weather[0].description);
                // create a p elemeent that displays the temp in farenheit
                var temp = $("<p>").text(`Temp: ${forecast.main.temp}\xB0F`);
                // create a p element for the humidity
                var humidity = $("<p>").text(`Humidity: ${forecast.main.humidity}%`);
                // append new elements to the card
                $(element).append(date, icon, desc, $("<br>"), temp, humidity);
                // increase pos by 8 to get to the next forecast in 24 hours
                pos += 8;
            });
        }); 
    }
    
    // displays the search history
    function displaySearch() {
        var list = $(".list-group");
        // empties all prev list content
        list.empty();
        $.each(searchArr, function(i, element) {
            // create a new list item
            var item = $("<li class='list-group-item'>");
            // create a span with the text as the city name
            var itemName = $("<span>").text(element);
            // creates a 'x' button for deletion of item
            var button = $("<button type='button' class='close' aria-label='Close'>");
            var close = $("<span aria-hidden='true'>&times;</span>");

            button.append(close);
            item.append(itemName, button);

            // append item to the list
            list.append(item);
        });
    }

    // gets forecast for city that was just searched for
    function getCityForecast(event) {
        event.preventDefault();
        // removes the hide class, so that the forecast
        // divs will be displayed
        $(".hide").removeClass("hide");
        // get city from the search input
        var city = $("input").val();
        // clear input box
        $("input").val("");

        // add city to the start of the array
        searchArr.unshift(city);
        // store array in local storage
        localStorage.setItem("search", JSON.stringify(searchArr));
        displaySearch();
        
        // store current city in local storage
        localStorage.setItem("currentCity", city);
        displayCurrentForecast(city);
        displayDailyForecast(city);  
    }

    // reloads the weather for the city clicked in the 
    // search history and places the city at the top of
    // the search history
    function restorePastSearch() {
        // gets the span element that holds the city name
        var city = $(this).children().first().text();
        localStorage.setItem("currentCity", city);
        // removes the city from the array, and returns an 
        // array of the removed item 
        var clicked = searchArr.splice(searchArr.indexOf(city), 1);
        // adds removed item back to the start of the array
        searchArr.unshift(clicked[0]);
        localStorage.setItem("search", JSON.stringify(searchArr));
        displaySearch();
        displayCurrentForecast(city);
        displayDailyForecast(city);
    }

    // when the 'x' button is clicked on the list item
    // deletes it from the search history
    function deleteSearchItem(event) {
        // stops the button click propogating the click
        // to the list item
        event.stopPropagation();
        // gets the span element that holds the city name,
        // and then deletes it from the array
        searchArr.splice(searchArr.indexOf($(this).prev().text()), 1);
        localStorage.setItem("search", JSON.stringify(searchArr));
        displaySearch();
    }

    function init() {
        var savedSearch = JSON.parse(localStorage.getItem("search"));
        var savedCity = localStorage.getItem("currentCity");

        // if there is a saved city display the forecast cards
        // and load the weather for the city, if there isn't
        // a city the page will just show the search box
        if (savedCity !== null) {
            $(".hide").removeClass("hide");
            displayCurrentForecast(savedCity);
            displayDailyForecast(savedCity);
        }

        if (savedSearch !== null) {
            searchArr = savedSearch;
            displaySearch();
        }
    }

    // event listener on the search button
    $("#search").click(getCityForecast);
    
    // event listener on the list item for the search history
    $(document).on("click", ".list-group-item", restorePastSearch);

    // event listener on the close (delete) button on the search
    // history to delete it from the list
    $(document).on("click", ".close", deleteSearchItem);

    init();
});