import Swal from 'sweetalert2';
import { domElements } from '.';
import { getLocationData, getIpAddressLocation } from './locations';

const myLocationBtnHandler = () => {
    domElements.myLocationBtn.onclick = async (event) => {
        event.preventDefault();

        const ipLocation = await getIpAddressLocation();
        sessionStorage.setItem("loc", JSON.stringify(await getLocationData(ipLocation)));

        domElements.searchForm.submit();
    }
}

const searchBtnHandler = () => {
    domElements.searchBtn.onclick = async(event) => {
        event.preventDefault();

        const location = domElements.locationInput.value;
        const geoCoord = await getLocationData(location);
        console.log(geoCoord);
        if (geoCoord) {
            sessionStorage.setItem("loc", JSON.stringify(geoCoord));
            
            domElements.searchForm.submit();
        }
        else {
            await errorMsg();
            sessionStorage.setItem("loc", '');
        }
    }
}

const errorMsg = async() => {
    Swal.fire({
        position: 'top-end',
        icon: 'error',
        title: 'Could not find the location!',
        showConfirmButton: false,
        timer: 1500,
    });
}

export default () => {
    
    myLocationBtnHandler();

    searchBtnHandler();

}
