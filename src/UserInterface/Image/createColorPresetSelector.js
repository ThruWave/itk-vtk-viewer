import style from '../ItkVtkViewer.module.css';

import ColorPresetNames from '../ColorPresetNames';

function createColorPresetSelector(
  uiContainer,
  viewerDOMId,
  lookupTableProxy,
  renderWindow
) {

  const presetLabel = document.createElement('label');
  presetLabel.setAttribute('class', style.selector);
  presetLabel.setAttribute('for', `${viewerDOMId}-colorMapSelector`);
  presetLabel.id = `${viewerDOMId}-colorMapLabel`;
  presetLabel.innerText = "Color Map: ";
  uiContainer.appendChild(presetLabel);

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
  uiContainer.appendChild(presetSelector);
  presetSelector.value = lookupTableProxy.getPresetName();

  return updateColorMap;
}

export default createColorPresetSelector;
