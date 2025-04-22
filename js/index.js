var searchInput = document.querySelector("#searchInput");
var findBtn = document.querySelector("#findBtn");
var rowData = document.querySelector("#rowData");

function getDateInfo(dateInput) {
  const date = new Date(dateInput);
  const options = { weekday: "long", year: "numeric", month: "long", day: "numeric" };
  const parts = date.toLocaleDateString("en-US", options).split(", ");

  return {
    weekday: parts[0],
    date: parts[1],
    year: date.getFullYear(),
    full: date.toLocaleDateString("en-US", options),
  };
}


async function search(location = searchInput.value) {
  let query = location;

  if (typeof location === "object" && location.lat && location.lon) {
    query = `${location.lat},${location.lon}`;
  }

  try {
    var result = await fetch(`https://api.weatherapi.com/v1/forecast.json?key=20ab3b9b13bf470ba26174737251804&q=${query}&days=3`);
    var data = await result.json();

    var forecast = data.forecast.forecastday;
    var location = data.location;
    var current = data.current;

    display(forecast, current, location);
  } catch (error) {
    console.log("Error fetching weather:", error);
    rowData.innerHTML = `<h3 class="text-white text-center">Unable to fetch weather data</h3>`;
  }
}

function getUserLocation() {
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const coords = {
          lat: position.coords.latitude,
          lon: position.coords.longitude
        };
        search(coords);
      },
      (error) => {
        console.warn("Geolocation failed, using fallback city");
        search("Cairo");
      }
    );
  } else {
    console.warn("Geolocation not supported");
    search("Cairo");
  }
}

window.addEventListener("load", getUserLocation);

searchInput.addEventListener("input", function () {
  search();
});

function display(forecast, current, location) {
  var cartona =
    ` <div class="row forecast-container g-0">
        <div class="col-md-4">
            <div class="forecast text-center">
                <div class="forecast-header d-flex justify-content-between p-2 w-100  text-center align-items-center">
                    <div class="day">${getDateInfo(forecast[0].date).weekday}</div>
                    <div class="date">${getDateInfo(forecast[0].date).date}</div>
                </div>
                <div class="forecast-content py-4 ">
                    <div class="location fs-3 fw-normal text-white-50">${location.name}</div>
                    <div class="degree text-white">
                        <div class="num display-1 fw-bolder">
                            ${current.temp_c}<sup>o</sup>C
                        </div>
                        <div class="forecast-icon">
                            <img src=${current.condition.icon} alt="icon" class="w-25">
                        </div>
                    </div>
                    <div class="custom">${current.condition.text}</div>
                    <span class="me-4">
                        <img src="https://routeweather.netlify.app/images/icon-wind.png" alt="icon">
                        20%
                    </span>
                    <span class="me-4">
                        <img src="https://routeweather.netlify.app/images/icon-wind.png" alt="icon">
                        18%
                    </span>
                    <span class="me-4">
                        <img src="https://routeweather.netlify.app/images/icon-compass.png" alt="icon">
                        East
                    </span>
                </div>
            </div>
        </div>
        <div class="col-md-4">
            <div class="forecast text-center">
                <div class="forecast-header d-flex justify-content-center p-2 w-100 text-center align-items-center">
                    <div class="day">${getDateInfo(forecast[1].date).weekday}</div>
                </div>
                <div class="forecast-content py-5 d-flex flex-column justify-content-between gap-2">
                    <div class="forecast-icon">
                        <img src=${forecast[1].day.condition.icon} alt="icon">
                    </div>
                    <div class="degree fs-3 fw-bolder">${forecast[1].day.maxtemp_c}<sup>o</sup>C</div>
                    <small class="text-white-50">${forecast[1].day.mintemp_c}<sup>o</sup></small>
                    <div class="custom">${forecast[1].day.condition.text}</div>
                </div>
            </div>
        </div>
        <div class="col-md-4">
            <div class="forecast text-center">
                <div class="forecast-header d-flex justify-content-center p-2 w-100 text-center align-items-center">
                    <div class="day text-center">${getDateInfo(forecast[2].date).weekday}</div>
                </div>
                <div class="forecast-content py-5 d-flex flex-column justify-content-between gap-2">
                    <div class="forecast-icon">
                        <img src=${forecast[2].day.condition.icon} alt="icon">
                    </div>
                    <div class="degree fs-3 fw-bolder">${forecast[2].day.maxtemp_c}<sup>o</sup>C</div>
                    <small class="text-white-50">${forecast[2].day.mintemp_c}<sup>o</sup></small>
                    <div class="custom">${forecast[2].day.condition.text}</div>
                </div>
            </div>
        </div>
    </div>`;

  rowData.innerHTML = cartona;
}
