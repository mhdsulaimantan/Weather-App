import { createLoader, removeLoader } from './loader';
import { hoursToDaysTab } from './dataTab';
import { domElements } from '.';

export default (() => {
    document.querySelectorAll('#view-data-btns input').forEach(btn => {
        btn.onclick = async (event) => {
            const loader = await createLoader();

            const activeUnit = domElements.celsiusBtn.checked ? 'metric' : 'imperial';
            const selectedView = event.target.id;

            await hoursToDaysTab(activeUnit, selectedView);

            await removeLoader(loader);
        }
    });
});
