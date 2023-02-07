import '../scss/styles.scss'
import { default as searchFormHandler } from './formHandler';
import { default as periodNavBarHandler } from './periodHandler'
import { addHeaderLogo } from './logo';
import { locationOptions } from './locations';
import { nowTab } from './dataTab'
import { default as unitsHandler } from './unitsHandler'
import { createLoader, removeLoader } from './loader';
import { checkSessionStorage, sessionData} from './session';

export const openWebMapApiKey = "04f0c7fc5bce6e13d7fa199ec478bb73";

export const domElements = (() => {
    const container = document.querySelector('#container');
    const header = document.querySelector('#header');
    const logoImg = new Image();
    const countriesList = document.querySelector('#locations-list');
    const searchForm = document.querySelector('#search-form')
    const searchBtn = document.querySelector('#search-btn');
    const locationInput = document.querySelector('#search-location');
    const myLocationBtn = document.querySelector('#my-location-btn');
    const periodBtnsList = document.querySelectorAll('#period-tab-btns button');
    const tabsData = document.querySelector('#tabs-data');
    const weatherIcon = document.querySelector('#weather-icon');
    const celsiusBtn = document.querySelector('#celsius');

    return {
        container,
        header,
        logoImg,
        countriesList,
        searchForm,
        searchBtn,
        locationInput,
        myLocationBtn,
        periodBtnsList,
        tabsData,
        weatherIcon,
        celsiusBtn
    }
})();

const myLocationBtnTooltip = (bootstrap) => {
    new bootstrap.Tooltip(domElements.myLocationBtn);
}

const searchInputValue = () => {
    domElements.locationInput.value = sessionData.cityName + ", " + sessionData.countryName;
}

const loadDefaultTab = async () => {
    await nowTab('metric');
}

window.onload = async () => {
    const bootstrap = require('bootstrap');

    const loader = await createLoader();
    
    await addHeaderLogo();

    Promise.all([await checkSessionStorage(), await loadDefaultTab()]);

    await removeLoader(loader);

    searchInputValue();

    myLocationBtnTooltip(bootstrap);

    searchFormHandler();

    periodNavBarHandler();

    unitsHandler();

    await locationOptions();
};
