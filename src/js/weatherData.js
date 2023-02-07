import { openWebMapApiKey } from "."
import { sessionData } from "./session";

export const currentWeatherData = async (unit) => {
    try {
        let url = new URL('https://api.openweathermap.org/data/2.5/weather');

        url.searchParams.set('lat', sessionData.latitude);
        url.searchParams.set('lon', sessionData.longitude);
        url.searchParams.set('units', unit);
        url.searchParams.set('cnt', 24);
        url.searchParams.set('appid', openWebMapApiKey);
        const request = await fetch(url);
        return request.json();
    }
    catch (err) {
        document.write(err);
    }
} 

export const hoursToDaysData = async (unit) => {
    try {
        const url = new URL('https://api.openweathermap.org/data/2.5/forecast');
        url.searchParams.set('lat', sessionData.latitude);
        url.searchParams.set('lon', sessionData.longitude);
        url.searchParams.set('units', unit);
        url.searchParams.set('appid', openWebMapApiKey);
        const request = await fetch(url);
        return request.json();
    }
    catch (err) {
        document.write(err);
    }
}