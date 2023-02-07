import { domElements } from '.'
import { createLoader, removeLoader } from './loader'
import { nowTab, hoursToDaysTab } from './dataTab'
import { default as viewsHandler } from './viewsHandler';

export default (() => {
    domElements.periodBtnsList.forEach(period => {
        period.onclick = async (event) => {
            
            const loader = await createLoader();
            const activeUnit = domElements.celsiusBtn.checked ? 'metric' : 'imperial';

            if (event.target.id === "now-tab") {
                await nowTab(activeUnit);
            }
            else if (event.target.id === "hours-to-days-tab") {
                await hoursToDaysTab(activeUnit, 'table-view');

                viewsHandler();
            }
            removeLoader(loader);
        }
    })
});