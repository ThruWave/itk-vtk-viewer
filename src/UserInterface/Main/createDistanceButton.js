import vtkDistanceWidget from 'vtk.js/Sources/Interaction/Widgets/DistanceWidget';

import style from '../ItkVtkViewer.module.css';

import distanceIcon from '../icons/ruler.svg';

function createDistanceButton(
  viewerDOMId,
  contrastSensitiveStyle,
  view,
  imageRepresentationProxy,
  mainUIRow,
) {
  let distanceWidget = null;
  let addDistanceChangedHandler = () => {};
  if (imageRepresentationProxy) {
    distanceWidget = vtkDistanceWidget.newInstance();
    distanceWidget.setInteractor(view.getInteractor());
    distanceWidget.setEnabled(false);

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

    let distanceEnabled = false;
    const toggleDistance = () => {
      distanceEnabled = !distanceEnabled;
      distanceWidget.setEnabled(distanceEnabled);
    };

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
  } // if(imageRepresentationProxy)

  return { distanceWidget, addDistanceChangedHandler };
}

export default createDistanceButton;
