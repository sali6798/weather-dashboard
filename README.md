# weather-dashboard

## Description
A dashboard that displays the weather based on the city searched using OpenWeather's Weather API. The dashboard will display the search history, current weather forecast and a 5 day forecast. On load, the page will display the search history and the weather for the last city displayed if it exists. If not, only the search bar will be displayed. When a new city is searched it is added to the top of the search history, and if a city in the history is clicked, the weather for that city will be loaded and will be placed back at the top of the history. If a user wants to delete a city from history, all that needs to be done is to click the 'x' button next to the city name. The card for the current forecast displays city name, current date, weather icon, temperature(F), humidity, wind speed and the UV index. The UV index's background changes color reflecting if the value is favorable, moderate or severe. The 5 day forecast is displayed in individual cards showing the date, weather icon, weather description, temperature(F) and humidity. Since the OpenWeather's API returns a forecast for every 3 hours, the start of the forecast is taken as the next time forecast that is the same time as 3 hours before the first forecast time returned from the API i.e. if the first forecast that is returned time is 00:00:00, then 5 day forecast will start from the next forecast at 21:00:00 and then every 24 hours from then, if the first forecast returned is at 18:00:00, the 5 day forecast will start with the next forecast at 15:00:00 and then every 24 hours. 

Issue: the site may not display accurate dates for cities in different timezones, especially cities in different countries. The date shown is calculated as the date for local time e.g. If the user was in America and looked at the weather in Australia, it would display the date as the current date in America rather than the date it is in Australia.

## Deployed Site
[Weather Dashboard](https://sali6798.github.io/weather-dashboard)

## Credits
* Bootstrap v4.4
* OpenWeather Weather API
* World Health Organization - [UV index information](https://www.who.int/uv/intersunprogramme/activities/uv_index/en/index1.html)