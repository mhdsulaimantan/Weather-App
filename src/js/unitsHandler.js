import { createLoader, removeLoader } from './loader';
import { hoursToDaysTab, nowTab } from './dataTab';
import { domElements } from '.';

export default (() => {
    document.querySelectorAll('#units-btns input').forEach(btn => {
        btn.onclick = async (event) => {
            const loader = await createLoader();

            const activeTabId = getActiveTabId();
            const selectedViewId = getSelectedViewId();

            if (event.target.id === "celsius") {
                await activateTab(activeTabId ,'metric', selectedViewId);
            }
            else if (event.target.id === "fahrenheit") {
                await activateTab(activeTabId, 'imperial', selectedViewId);
            }
            await removeLoader(loader);
        }
    });
});

const getActiveTabId = () => {
    let tabId;
    domElements.periodBtnsList.forEach(period => {
        if (period.getAttribute('aria-selected') === "true") {
            tabId = period.id;
        }
    });
    return tabId;
}

const getSelectedViewId = () => {
    let viewId;
    document.querySelectorAll('#view-data-btns input').forEach(view => {
        console.log(view)
        if (view.checked === true) {
            viewId = view.id;
        }
    });
    return viewId; 
}

const activateTab = async (tabId, unit, selectedView) => {
    if (tabId === "now-tab") await nowTab(unit);
    else if (tabId === "hours-to-days-tab") await hoursToDaysTab(unit, selectedView);
}