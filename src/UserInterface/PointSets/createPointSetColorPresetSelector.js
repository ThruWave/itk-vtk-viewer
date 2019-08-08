import style from '../ItkVtkViewer.module.css';

import ColorPresetNames from '../ColorPresetNames';
import opacityIcon from "../icons/opacity.svg";

function createPointSetColorPresetSelector(
  pointSetHasScalars,
  viewerDOMId,
  renderWindow,
  pointSetRepresentationProxies,
  pointSetSelector,
  pointSetColorPresetRow
) {
  const pointSetColorPresets = new Array(pointSetHasScalars.length);
  const defaultPointSetColorPreset = '2hot';
  pointSetColorPresets.fill(defaultPointSetColorPreset);

  const presetLabel = document.createElement('label');
  presetLabel.setAttribute('class', style.selector);
  presetLabel.setAttribute('for', `${viewerDOMId}-pointSetColorMapSelector`);
  presetLabel.id = `${viewerDOMId}-pointSetColorMapLabel`;
  presetLabel.innerText = "Color Map: ";

  const presetOptions = ColorPresetNames
    .map((name) => `<option value="${name}">${name}</option>`)
    .join('');

  const presetSelector = document.createElement('select');
  presetSelector.setAttribute('class', style.selector);
  presetSelector.id = `${viewerDOMId}-pointSetColorMapSelector`;
  presetSelector.innerHTML = `${presetOptions}`;

  pointSetSelector.addEventListener('change',
    (event) => {
      presetSelector.value = pointSetColorPresets[pointSetSelector.selectedIndex]
      if (pointSetHasScalars[pointSetSelector.selectedIndex]) {
        pointSetColorPresetRow.style.display = 'flex';
      } else {
        pointSetColorPresetRow.style.display = 'none';
      }
    });

  function updateColorMap(event) {
    const value = event.target.value;
    pointSetRepresentationProxies.forEach((proxy) => {
      const lutProxy = proxy.getLookupTableProxy();
      if (lutProxy) {
        lutProxy.setPresetName(value);
      }
    })
    renderWindow.render();
    pointSetColorPresets[pointSetSelector.selectedIndex] = value;
  }
  presetSelector.addEventListener('change', updateColorMap);

  pointSetRepresentationProxies.forEach((proxy) => {
    const lutProxy = proxy.getLookupTableProxy();
    if(lutProxy) {
      lutProxy.setPresetName(defaultPointSetColorPreset);
    }
  })
  if (pointSetHasScalars[pointSetSelector.selectedIndex]) {
    pointSetColorPresetRow.style.display = 'flex';
  } else {
    pointSetColorPresetRow.style.display = 'none';
  }
  presetSelector.value = defaultPointSetColorPreset;

  pointSetColorPresetRow.appendChild(presetSelector);
}

export default createPointSetColorPresetSelector;
