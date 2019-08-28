import vtkDistanceWidget from 'vtk.js/Sources/Interaction/Widgets/DistanceWidget';

import style from '../ItkVtkViewer.module.css';

import distanceIcon from '../icons/sample-distance.svg';
import resetDistanceIcon from '../icons/reset-crop.svg';

function createDistanceButton(
  viewerDOMId,
  contrastSensitiveStyle,
  view,
  imageRepresentationProxy,
  mainUIRow
) {
  let distanceWidget = null;
  let addDistanceChangedHandler = () => {};
  let addResetDistanceHandler = () => {};
  if (imageRepresentationProxy) {
    distanceWidget = vtkDistanceWidget.newInstance();
    distanceWidget.setInteractor(view.getInteractor());
    distanceWidget.setEnabled(false);
    // distanceWidget.setVolumeMapper(imageRepresentationProxy.getMapper());

    const distanceChangedHandlers = [];
    addDistanceChangedHandler = (handler) => {
      const index = distanceChangedHandlers.length;
      distanceChangedHandlers.push(handler);
      function unsubscribe() {
        distanceChangedHandlers[index] = null;
      }
      return Object.freeze({ unsubscribe });
    };

    let distanceUpdateInProgress = false;
    // eslint-disable-next-line no-unused-vars
    const setDistance = () => {
      if (distanceUpdateInProgress) {
        return;
      }
      distanceUpdateInProgress = true;
      // eslint-disable-next-line prefer-destructuring
      const distance = distanceWidget.getWidgetState().distance;
      imageRepresentationProxy.setDistance(distance);
      distanceChangedHandlers.forEach((handler) => {
        handler.call(null, distance);
      });
      distanceUpdateInProgress = false;
    };
    // const debouncedSetCroppingPlanes = macro.debounce(setDistance, 100);
    // distanceWidget.onCroppingPlanesChanged(debouncedSetCroppingPlanes);

    let distanceEnabled = false;
    // eslint-disable-next-line no-inner-declarations
    function toggleDistance() {
      distanceEnabled = !distanceEnabled;
      distanceWidget.setEnabled(distanceEnabled);
    }

    const distanceButton = document.createElement('div');
    distanceButton.innerHTML = `<input id="${viewerDOMId}-toggleDistanceButton" type="checkbox" class="${
      style.toggleInput
    }"><label itk-vtk-tooltip itk-vtk-tooltip-bottom itk-vtk-tooltip-content="Measure Distance" class="${
      contrastSensitiveStyle.invertibleButton
    } ${style.distanceButton} ${
      style.toggleButton
    }" for="${viewerDOMId}-toggleDistanceButton">${distanceIcon}</label>`;
    distanceButton.addEventListener('change', (event) => {
      toggleDistance();
    });
    mainUIRow.appendChild(distanceButton);

    const resetDistanceButton = document.createElement('div');
    resetDistanceButton.innerHTML = `<input id="${viewerDOMId}-resetDistanceButton" type="checkbox" class="${
      style.toggleInput
    }" checked><label itk-vtk-tooltip itk-vtk-tooltip-bottom itk-vtk-tooltip-content="Clear Distance Measuring" class="${
      contrastSensitiveStyle.invertibleButton
    } ${style.resetDistanceButton} ${
      style.toggleButton
    }" for="${viewerDOMId}-resetDistanceButton">${resetDistanceIcon}</label>`;

    const resetDistanceHandlers = [];
    addResetDistanceHandler = (handler) => {
      const index = resetDistanceHandlers.length;
      resetDistanceHandlers.push(handler);
      function unsubscribe() {
        resetDistanceHandlers[index] = null;
      }
      return Object.freeze({ unsubscribe });
    };

    // eslint-disable-next-line no-inner-declarations
    function resetDistance() {
      imageRepresentationProxy.getDistanceFilter().reset();
      distanceWidget.resetWidgetState();
      resetDistanceHandlers.forEach((handler) => {
        handler.call(null);
      });
    }
    resetDistanceButton.addEventListener('change', (event) => {
      event.preventDefault();
      event.stopPropagation();
      resetDistance();
    });

    resetDistanceButton.addEventListener('click', (event) => {
      event.preventDefault();
      event.stopPropagation();
      resetDistance();
    });
    mainUIRow.appendChild(resetDistanceButton);
  } // if(imageRepresentationProxy)

  return { distanceWidget, addDistanceChangedHandler, addResetDistanceHandler };
}

export default createDistanceButton;
