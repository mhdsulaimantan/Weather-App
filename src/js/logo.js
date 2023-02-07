import { domElements } from './index'
import cloudyLogo from '../img/cloudy-logo.png'

// load logo image
const loadImage = async (path) => {
    let img = domElements.logoImg;
    const imageLoadPromise = new Promise((resolve, reject) => {
        if (resolve) {
            img = new Image();
            img.onload = resolve;
            img.src = path;
        }
        else { reject("There is no image in this path!!") }
    })
    await imageLoadPromise;
    return img;
}

export const addHeaderLogo = async () => {
    const img = await loadImage(cloudyLogo);
    img.id = "logo-img";
    img.className = "img-responsive img-circle rounded mr-auto p-2"
    domElements.header.prepend(img);
}