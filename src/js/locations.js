import { openWebMapApiKey, domElements } from '.';

const getAllLocations = async () => {
    try {
        const request = await fetch('https://countriesnow.space/api/v0.1/countries');
        const response = await request.json();
        return response.data;
    }
    catch (err){
        document.write(err);
    }
}

export const locationsList = async () => {
    let locationsArr = [];
    const locationsObj = await getAllLocations();
    locationsObj.forEach( location => {
        location.cities.forEach( city =>{
            locationsArr.push(city + ", " + location.country)
        })
    })
    return locationsArr.sort();
}

export const locationOptions = async () => {
    const locations = await locationsList();
    locations.forEach( location => {
        const option = document.createElement('option');
        option.value = location;
        domElements.countriesList.appendChild(option);
    });
}

export const getIpAddressLocation = async() => {
    try{
        const request = await fetch("https://ipapi.co/json/");
        const response = await request.json();
        const location = response.city + ", " + response.country_name;
        return location;
    }
    catch(err){
        document.write(err);
    }
}

export const getLocationData = async (location) => {
    try {
        const url = new URL("https://api.openweathermap.org/geo/1.0/direct");
        url.searchParams.set('q', location);
        url.searchParams.set('appid', openWebMapApiKey);
        
        const request = await fetch(url);    
        const response = await request.json();
        
        const countryCode = response[0].country;
        const countryName = getCountryName(countryCode);
       
        const locationData = {
            "latitude" : response[0].lat, 
            "longitude": response[0].lon,
            "cityName": response[0].name,
            "countryName": countryName
        }
        return locationData;
    }
    catch (err){
        return null;
    }
}

const getCountryName = (code) => {
    let countryNames = new Intl.DisplayNames(['en'], {type: 'region'});
    return countryNames.of(code);
}