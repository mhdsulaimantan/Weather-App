import { getLocationData, getIpAddressLocation } from "./locations";

export let sessionData;

export const checkSessionStorage = async () => {
    try {
        if (!sessionStorage.getItem('loc')) {
            await getIpAddressLocation().then(async (ipLocation) => {
                await getLocationData(ipLocation).then((value) => {
                    sessionStorage.setItem('loc', JSON.stringify(value));
                });
            });
        }
        sessionData = JSON.parse(sessionStorage.getItem('loc')) || [];
    }
    catch (err) {
        document.write(err);
    }
}