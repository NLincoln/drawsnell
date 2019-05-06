import {
    getPositionOfEventOnElement,
    getPixelCoordsInCanvas,
    getActualColorAtLayerCoord
} from '../canvasHelpers';

export default function eyedropper(event, mainComp, activeLayers, drawColor, setColor){
    let position = getPositionOfEventOnElement(event);
    position = getPixelCoordsInCanvas(position);
    let color = getActualColorAtLayerCoord(mainComp, activeLayers, position.x, position.y);
    if(color !== drawColor && color){
      setColor(color);
    }
  }