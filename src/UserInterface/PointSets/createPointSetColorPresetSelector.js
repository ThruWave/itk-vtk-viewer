import style from '../ItkVtkViewer.module.css';

import ColorPresetNames from '../ColorPresetNames';
import ColorMapIcon from "../icons/color-map.svg";
import getContrastSensitiveStyle from "../getContrastSensitiveStyle";

function createPointSetColorPresetSelector(
  pointSetHasScalars,
  viewerDOMId,
  renderWindow,
  pointSetRepresentationProxies,
  isBackgroundDark,
  pointSetSelector,
  pointSetColorPresetRow
) {
  const pointSetColorPresets = new Array(pointSetHasScalars.length);
  const defaultPointSetColorPreset = 'Rainbow Blended White';
  pointSetColorPresets.fill(defaultPointSetColorPreset);

  const contrastSensitiveStyle = getContrastSensitiveStyle(
    ['invertibleButton'],
    isBackgroundDark
  );

  const presetEntry = document.createElement('div');
  presetEntry.setAttribute('class', style.sliderEntry);
  presetEntry.innerHTML = `
    <div itk-vtk-tooltip itk-vtk-tooltip-bottom itk-vtk-tooltip-content="ColorMap" class="${
    contrastSensitiveStyle.invertibleButton
    } ${style.colorMapButton}">
      ${ColorMapIcon}
    </div>`;

  const presetLabel = document.createElement('Label');
  presetLabel.setAttribute('class', style.selectorLabel);
  presetLabel.setAttribute('for', `${viewerDOMId}-pointSetColorMapSelector`);
  presetLabel.id = `${viewerDOMId}-pointSetColorMapLabel`;
  presetLabel.innerHTML = "Color Map: ";
  presetEntry.appendChild(presetLabel);

  const presetOptions = ColorPresetNames
    .map((name) => `<option value="${name}">${name}</option>`)
    .join('');

  const presetSelector = document.createElement('select');
  presetSelector.setAttribute('class', style.selector);
  presetSelector.id = `${viewerDOMId}-pointSetColorMapSelector`;
  presetSelector.innerHTML = presetOptions;
  presetEntry.appendChild(presetSelector);

  pointSetColorPresetRow.appendChild(presetEntry);

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
