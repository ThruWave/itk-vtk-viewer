import style from '../ItkVtkViewer.module.css';

import ColorPresetNames from '../ColorPresetNames';
import ColorMapIcon from "../icons/color-map.svg";
import getContrastSensitiveStyle from "../getContrastSensitiveStyle";

function createColorPresetSelector(
  uiContainer,
  viewerDOMId,
  lookupTableProxy,
  isBackgroundDark,
  renderWindow
) {
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

  const presetLabel = document.createElement('label');
  presetLabel.setAttribute('class', style.selectorLabel);
  presetLabel.setAttribute('for', `${viewerDOMId}-colorMapSelector`);
  presetLabel.id = `${viewerDOMId}-colorMapLabel`;
  presetLabel.innerText = "Color Map: ";
  presetEntry.appendChild(presetLabel);

  const presetSelector = document.createElement('select');
  presetSelector.setAttribute('class', style.selector);
  presetSelector.id = `${viewerDOMId}-colorMapSelector`;
  presetSelector.innerHTML = ColorPresetNames
    .map((name) => `<option value="${name}">${name}</option>`)
    .join('');

  function updateColorMap(event) {
    lookupTableProxy.setPresetName(presetSelector.value);
    renderWindow.render();
  }
  presetSelector.addEventListener('change', updateColorMap);
  presetEntry.appendChild(presetSelector);
  uiContainer.appendChild(presetEntry);
  presetSelector.value = lookupTableProxy.getPresetName();

  return updateColorMap;
}

export default createColorPresetSelector;
