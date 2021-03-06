import { autorun, reaction, action } from 'mobx';

import getContrastSensitiveStyle from '../getContrastSensitiveStyle';
import createCategoricalColorIconSelector from '../createCategoricalColorIconSelector';
import applyCategoricalColorToLookupTableProxy from '../applyCategoricalColorToLookupTableProxy';

import style from '../ItkVtkViewer.module.css';

import opacityIcon from '../icons/opacity.svg';

function createLabelMapColorWidget(
  store,
  uiContainer,
) {
  const viewerDOMId = store.id;

  const labelMapColorUIGroup = document.createElement('div');
  labelMapColorUIGroup.setAttribute('class', style.uiGroup);

  const labelMapWidgetRow = document.createElement('div');
  labelMapWidgetRow.setAttribute('class', style.uiRow);
  labelMapWidgetRow.className += ` ${viewerDOMId}-toggle`;

  const contrastSensitiveStyle = getContrastSensitiveStyle(
    ['invertibleButton'],
    store.isBackgroundDark
  );


  const categoricalColorSelector = document.createElement('div');
  categoricalColorSelector.id = `${store.id}-labelMapCategoricalColorSelector`;

  const iconSelector = createCategoricalColorIconSelector(categoricalColorSelector);

  let customIcon = null;
  function updateDisplayedCategoricalColor() {
    const categoricalColor = store.imageUI.labelMapCategoricalColor;

    const lookupTableProxy = store.imageUI.labelMapLookupTableProxy;
    const colorTransferFunction = lookupTableProxy.getLookupTable();

    if (categoricalColor.startsWith('Custom')) {
      // TODO
      //lookupTableProxy.setMode(vtkLookupTableProxy.Mode.RGBPoints)
      //transferFunctionWidget.applyOpacity(piecewiseFunction);
      //const colorDataRange = transferFunctionWidget.getOpacityRange();
      //if (!!colorDataRange) {
        //colorTransferFunction.setMappingRange(...colorDataRange);
      //}
      //colorTransferFunction.updateRange();

      //const isIcons = iconSelector.getIcons();
      //if (!!!customIcon) {
        //const categoricalColorIcon = customColorMapIcon(colorTransferFunction, colorDataRange);
        //customIcon = { 'iconFilePath': categoricalColorIcon, 'iconValue': categoricalColor };
        //icons.push(customIcon);
        //iconSelector.refresh(icons);
      //} else if(isIcons[isIcons.length-1].iconValue !== categoricalColor) {
        //const categoricalColorIcon = customColorMapIcon(colorTransferFunction, colorDataRange);
        //isIcons[isIcons.length-1].element.src = categoricalColorIcon;
        //isIcons[isIcons.length-1].iconFilePath = categoricalColorIcon;
        //isIcons[isIcons.length-1].iconValue = categoricalColor;
        //isIcons[isIcons.length-1].element.setAttribute('icon-value', categoricalColor);
        //isIcons[isIcons.length-1].element.setAttribute('alt', categoricalColor);
        //isIcons[isIcons.length-1].element.setAttribute('title', categoricalColor);
      //}
    } else {
      applyCategoricalColorToLookupTableProxy(lookupTableProxy, store.imageUI.labelMapLabels, categoricalColor);
    }
    iconSelector.setSelectedValue(categoricalColor);
  }
  reaction(() => { return store.imageUI.labelMapCategoricalColor },
    (categoricalColor) => {
      updateDisplayedCategoricalColor();
    }
  )
  categoricalColorSelector.addEventListener('changed',
    action((event) => {
      event.preventDefault();
      event.stopPropagation();
      store.imageUI.labelMapCategoricalColor = iconSelector.getSelectedValue();
    })
  );
  iconSelector.setSelectedValue(store.imageUI.labelMapCategoricalColor);


  const defaultLabelMapColorOpacity = 0.75;

  const sliderEntry = document.createElement('div');
  sliderEntry.setAttribute('class', style.sliderEntry);
  sliderEntry.innerHTML = `
    <div itk-vtk-tooltip itk-vtk-tooltip-top itk-vtk-tooltip-content="Gradient opacity" class="${
      contrastSensitiveStyle.invertibleButton
    } ${style.gradientOpacitySlider}">
      ${opacityIcon}
    </div>
    <input type="range" min="0" max="1" value="${defaultLabelMapColorOpacity}" step="0.01"
      id="${store.id}-labelMapColorOpacitySlider"
      class="${style.slider}" />`;
  const opacityElement = sliderEntry.querySelector(
    `#${store.id}-labelMapColorOpacitySlider`
  );
  const volume = store.imageUI.representationProxy.getVolumes()[0]
  const volumeProperty = volume.getProperty()
  function updateLabelMapColorOpacity() {
    const labelMapOpacity = store.imageUI.labelMapOpacity;
    opacityElement.value = labelMapOpacity;
    const numberOfComponents = store.imageUI.numberOfComponents;
    volumeProperty.setComponentWeight(numberOfComponents, labelMapOpacity);
    store.renderWindow.render();
  }
  autorun(() => {
    updateLabelMapColorOpacity();
  })
  opacityElement.addEventListener('input', action((event) => {
      event.preventDefault();
      event.stopPropagation();
      store.imageUI.labelMapOpacity = Number(opacityElement.value);
  }));
  autorun(() => {
    const haveImage = !!store.imageUI.image;
    if (haveImage) {
      sliderEntry.style.display = 'flex';
    } else {
      sliderEntry.style.display = 'none';
    }
  })

  labelMapWidgetRow.appendChild(categoricalColorSelector);
  labelMapWidgetRow.appendChild(sliderEntry);

  labelMapColorUIGroup.appendChild(labelMapWidgetRow);
  uiContainer.appendChild(labelMapColorUIGroup);
}

export default createLabelMapColorWidget;
