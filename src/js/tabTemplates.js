import { domElements } from "."
import { currentWeatherData, hoursToDaysData } from "./weatherData";
import { sessionData } from "./session";
import Chart from 'chart.js/auto'

function importAllSvgIcons(r) {
    let icons = {};
    r.keys().map((item, index) => { icons[item.replace('./', '')] = r(item); });
    return icons;
}

const icons = importAllSvgIcons(require.context('../img/weather-icons', false, /\.(svg)$/));

const iconCode = {
    "01d": icons["day.svg"],
    "01n": icons["night.svg"],
    "02d": icons["cloudy-day-1.svg"],
    "02n": icons["cloudy-night-1.svg"],
    "03d": icons["cloudy.svg"],
    "03n": icons["cloudy.svg"],
    "04d": icons["cloudy.svg"],
    "04n": icons["cloudy.svg"],
    "09d": icons["rainy-7.svg"],
    "09n": icons["rainy-7.svg"],
    "10d": icons["rainy-1.svg"],
    "10n": icons["rainy-4.svg"],
    "11d": icons["thunder.svg"],
    "11n": icons["thunder.svg"],
    "13d": icons["snowy-6.svg"],
    "13n": icons["snowy-6.svg"],
    "50d": icons['mist.svg'],
    "50n": icons['mist.svg']
}

export const nowHtmlTemplate = async (unit) => {
    const data = getUsefulData(await currentWeatherData(unit));

    domElements.tabsData.innerHTML = `<div class="tab-pane d-flex flex-column gap-3 rounded bg-body-tertiary shadow text-center p-3 w-100 fade show active" id="now-tab-data">
    <div class="d-flex justify-content-between align-items-center w-100" id="now-tab-data-header">
        <div>
            <h4 id="location-header">${sessionData.cityName + ", " + sessionData.countryName}</h4>
            <div class="text-info" >${new Date(data.timeStamp * 1000).toLocaleTimeString('en-US', { weekday: 'short', day: '2-digit', month: '2-digit', year: '2-digit', hour: '2-digit', minute: '2-digit', second: '2-digit', timeZoneName: 'short' })}</div> 
        </div>
        <div class="d-flex text-primary align-content-center gap-2" id="position-coordinates">
            <i class="bi bi-geo text-danger fs-2"></i>
            <div id="coordinates-metrics">
                <div id="latitude">Latitude: ${data.latitude}</div>
                <div id="longitude">Longitude: ${data.longitude}</div>
            </div>
        </div>
    </div>
    <div class="container" id="now-tab-data-body">
        <div class="d-flex flex-wrap align-items-center justify-content-evenly">
            <div class="d-flex flex-column align-items-center gap-5 p-2">
                <img id="weather-icon" src="${data.weatherIcon}">
                <div class="fs-4">${data.weatherStatus}, ${data.weatherDesc}</div>
                <div class="container d-flex gap-3 fw-bold">
                    <div><i class="fs-5 text-warning bi bi-sunrise"></i> ${data.sunrise}</div>
                    <div><i class="fs-5 text-warning bi bi-sunset"></i> ${data.sunset}</div>
                </div>
            </div>
            <div class="p-3 d-flex flex-column gap-4">
                <div class="fs-1 fw-medium text-success" id="temp">${data.temp} ${unit === "metric" ? ' °C' : ' °F'}</div>
            </div>
        
            <div class="d-flex flex-column align-items-center">
                    <div class="text-secondary"><i class="bi bi-thermometer-half"></i> Feels Like: <span class="text-black" id="feels-like-temp">${data.feelsLikeTemp} ${unit === "metric" ? ' °C' : ' °F'}</span></div>
                    <div class="text-secondary"><i class="bi bi-arrow-down"></i> Min Temperature: <span class="text-black" id="min-temp">${data.minTemp} ${unit === "metric" ? ' °C' : ' °F'}</span></div>
                    <div class="text-secondary"><i class="bi bi-arrow-up"></i> Max Temperature: <span class="text-black" id="max-temp">${data.maxTemp} ${unit === "metric" ? ' °C' : ' °F'}</span></div>
                    <div class="text-secondary"><i class="bi bi-droplet-half"></i> Humidity: <span class="text-black" id="humidity">${data.humidity} %</span></div>
                    <div class="text-secondary"><i class="bi bi-stopwatch"></i> Pressure: <span class="text-black" id="pressure">${data.pressure} hPa</span></div>
                    <div class="text-secondary"><i class="bi bi-wind"></i> Wind: <span class="text-black" id="wind-speed">${data.windSpeed} ${unit === "metric" ? 'meters/sec' : 'miles/hour'}</span></div>
            </div>
        </div>
    </div>
</div>`

}
export const hoursToDaysTemplate = async (unit, selectedView) => {
    const description = createDescription();
    const dataViewBtns = createDataViewBtns(selectedView);
    let viewDom;
    if (selectedView === "table-view") {
        viewDom = await tableTemplate(unit);
    }
    else if (selectedView === "chart-view") {
        viewDom = await chartTemplate(unit);
    }

    domElements.tabsData.append(description, dataViewBtns, viewDom);
}

const tableTemplate = async (unit) => {

    return await createAccordion(unit);
}

const chartTemplate = async (unit) => {

    return await createChart(unit);
}

const createChart = async (unit) => {
    const chartContainer = document.createElement('div');
    chartContainer.className = "chart-container bg-light";

    const chartCanvas = document.createElement('canvas');
    chartCanvas.id = "chart";

    const data = await hoursToDaysData(unit);

    let chartData = [];
    let usefulData;

    data.list.forEach(hourDayData => {
        usefulData = getUsefulData(hourDayData);
        chartData.push({
            date: new Date(usefulData.timeStamp * 1000).toLocaleTimeString('en-US', { weekday: 'short', hour: '2-digit', minute: '2-digit', hour12: true }),
            temp: usefulData.temp,
        });
    });

    new Chart(
        chartCanvas,
        {
            type: 'line',
            options: {
                maintainAspectRatio: false,
                responsive: true,
                animation: true,
                plugins: {
                    title: {
                        display: true,
                        text: '3H/5D Line Chart'
                    },
                    legend: {
                        display: true
                    },
                    tooltip: {
                        callbacks: {
                            label: function (context) {
                                return `Temperature: ${context.parsed.y}${unit === 'metric' ? ' °C' : ' °F'}`;
                            }
                        }
                    }
                }
            },
            data: {
                labels: chartData.map(row => row.date),
                datasets: [
                    {
                        fill: {
                            target: 'origin',
                            above: 'rgb(255, 191, 0)',
                            below: 'rgb(0, 220, 255 )'
                        },
                        label: 'Temperature',
                        data: chartData.map(row => row.temp)
                    }
                ]
            },
        }
    );

    chartContainer.appendChild(chartCanvas);

    return chartContainer;
}

const createDescription = () => {
    const description = document.createElement('div');
    description.className = "fs-5 fw-bold text-success text-center";
    description.textContent = "Weather data for the next 5 days every 3 hours."

    return description;
}

const createDataViewBtns = (selectedView) => {
    const dataViewBtns = document.createElement('div');
    dataViewBtns.className = "btn-group w-75";
    dataViewBtns.id = "view-data-btns";
    dataViewBtns.setAttribute('role', 'group');
    dataViewBtns.setAttribute('aria-label', 'metric button group');

    const inputTableView = document.createElement('input');
    inputTableView.className = "btn-check";
    inputTableView.id = "table-view";
    inputTableView.name = "btnradios2";
    inputTableView.type = "radio";
    inputTableView.autocomplete = "off";
    inputTableView.checked = true ? selectedView === 'table-view' : false;

    const labelTableView = document.createElement('label');
    labelTableView.className = "btn btn-outline-dark";
    labelTableView.setAttribute("for", "table-view");
    labelTableView.textContent = "Table View"

    const inputChartView = document.createElement('input');
    inputChartView.className = "btn-check";
    inputChartView.id = "chart-view";
    inputChartView.name = "btnradios2"
    inputChartView.type = "radio";
    inputChartView.autocomplete = "off";
    inputChartView.checked = true ? selectedView === 'chart-view' : false;

    const labelChartView = document.createElement('label');
    labelChartView.className = "btn btn-outline-dark";
    labelChartView.setAttribute("for", "chart-view");
    labelChartView.textContent = "Chart View";

    dataViewBtns.append(inputTableView, labelTableView, inputChartView, labelChartView);

    return dataViewBtns;
}

const createAccordion = async (unit) => {
    const accordion = document.createElement('div');
    accordion.id = "hours-to-days-accordion";
    accordion.className = "accordion w-100";

    const data = await hoursToDaysData(unit);
    data.list.forEach((hourDayData, hourDayNum) => {
        const accordionItem = createAccordionItem(getUsefulData(hourDayData), hourDayNum, unit);
        accordion.innerHTML += accordionItem;
    });

    return accordion;
}

const createAccordionItem = (data, hourDayNum, unit) => {
    const accordionItem = `
        <div class="accordion-item">
            <h2 class="accordion-header w-100" id="day-data">
                <button class="accordion-button" type="button" data-bs-toggle="collapse" data-bs-target="#${'hour-day-' + hourDayNum}" aria-expanded="true" aria-controls="${'hour-day-' + hourDayNum}">
                <div class="d-flex align-items-center text-center row row-col-5 w-100">
                        <div class="col-sm-2" id="day-date">${new Date(data.timeStamp * 1000).toLocaleTimeString('en-US', { weekday: 'short', hour: '2-digit', minute: '2-digit', hour12: true })}</div>
                        <div class="fw-bold fs-4 col-sm-3" id="day-temp">${data.temp} ${unit === "metric" ? ' °C' : ' °F'}</div>
                        <img class="col-sm-1" src="${data.weatherIcon}" id="weather-icon">
                        <div class="col-sm-3" id="weather-desc">${data.weatherStatus}, ${data.weatherDesc}</div>
                        <div class="col-sm-2" id="day-humidity">${data.humidity} %</div>
                    </div>
                </button>
            </h2>
            <div id="${'hour-day-' + hourDayNum}" class="accordion-collapse collapse" aria-labelledby="${'hour-day-' + hourDayNum}" data-bs-parent="#${'hour-day-' + hourDayNum}">
                <div class="accordion-body container text-center">
                    <div class="row">       
                        <div class="text-secondary col-sm-2"><i class="bi bi-thermometer-half"></i> Feels Like: <span class="text-black" id="feels-like-temp">${data.feelsLikeTemp} ${unit === "metric" ? ' °C' : ' °F'}</span></div>
                        <div class="text-secondary col-sm-2"><i class="bi bi-arrow-down"></i> Min Temperature: <span class="text-black" id="min-temp">${data.minTemp} ${unit === "metric" ? ' °C' : ' °F'}</span></div>
                        <div class="text-secondary col-sm-2"><i class="bi bi-arrow-up"></i> Max Temperature: <span class="text-black" id="max-temp">${data.maxTemp} ${unit === "metric" ? ' °C' : ' °F'}</span></div>
                        <div class="text-secondary col-sm-2"><i class="bi bi-droplet-half"></i> Humidity: <span class="text-black" id="humidity">${data.humidity} %</span></div>
                        <div class="text-secondary col-sm-2"><i class="bi bi-stopwatch"></i> Pressure: <span class="text-black" id="pressure">${data.pressure} hPa</span></div>
                        <div class="text-secondary col-sm-2"><i class="bi bi-wind"></i> Wind: <span class="text-black" id="wind-speed">${data.windSpeed} ${unit === "metric" ? ' meter/sec' : ' miles/hour'}</span></div>
                    </div>
                </div>
            </div>
        </div>`

    return accordionItem;
}

const getUsefulData = (data) => {
    const latitude = sessionData.latitude;
    const longitude = sessionData.longitude;
    const weatherIcon = iconCode[data.weather[0].icon];
    const weatherStatus = data.weather[0].main;
    const weatherDesc = data.weather[0].description;
    const sunrise = new Date(data.sys.sunrise * 1000).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true });
    const sunset = new Date(data.sys.sunset * 1000).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true });
    const humidity = data.main.humidity;
    const pressure = data.main.pressure;
    const timeStamp = data.dt;
    const temp = Math.round(data.main.temp);
    const feelsLikeTemp = Math.round(data.main.feels_like);
    const minTemp = Math.round(data.main.temp_min);
    const maxTemp = Math.round(data.main.temp_max);
    const windSpeed = data.wind.speed;

    return { latitude, longitude, weatherIcon, weatherStatus, weatherDesc, sunrise, sunset, humidity, pressure, temp, feelsLikeTemp, minTemp, maxTemp, windSpeed, timeStamp }
}
