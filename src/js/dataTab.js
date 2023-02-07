import { domElements } from '.';
import { nowHtmlTemplate, hoursToDaysTemplate } from './tabTemplates';
import viewsHandler from './viewsHandler';

export const nowTab = async (unit) => {
    clearTabData();
    await nowHtmlTemplate(unit);
};

export const hoursToDaysTab = async (unit, selectedView) => {
    clearTabData();
    await hoursToDaysTemplate(unit, selectedView);
    viewsHandler();
};

const clearTabData = () => {
    domElements.tabsData.innerHTML = '';
}