export const CANVAS_SIZE_X = 40; // 40 "fake" pixels
export const CANVAS_SIZE_Y = 40; // 40 "fake" pixels
export const TILE_SIZE = 16; // each "fake" pixel is 64x64 real pixels

/**
 * Given the coordinates that an event occurred on the
 * canvas, find out what the corresponding coordinates
 * in "pixel" space are.
 * @param {{ x: number, y: number }} param
 */
export function getPixelCoordsInCanvas({ x, y }) {
    return {
        x: Math.floor(x / TILE_SIZE),
        y: Math.floor(y / TILE_SIZE)
    };
}

/**
 * So normal events have two things:
 * 1. Where the event occurred _on the page_
 * 2. What element the event occurred on
 * We can use those two pieces of information to get
 * where the event occurred on the element it was triggered
 * on
 * @param {MouseEvent} event
 */
export function getPositionOfEventOnElement(event) {
    let boundingRect = event.target.getBoundingClientRect();
    let style = getComputedStyle(event.target);
    let borderLeft = parseInt(style.borderLeftWidth);
    let borderTop = parseInt(style.borderTopWidth);

    return {
        x: event.clientX - boundingRect.left - borderLeft,
        y: event.clientY - boundingRect.top - borderTop
    };
}

/**
 * Shorthand for getPositionOfEventOnElement > getPixelCoordsInCanvas
 * @param {MouseEvent} event
 */
export function getPixelCoordsOfEvent(event) {
    return getPixelCoordsInCanvas(getPositionOfEventOnElement(event));
}

// This returns the color at a specific pixel in the topmost layer
export function getColorAtLayerCoord(mainComp, activeLayers, x, y) {
    // Ensure all active layers share the same color at this point

    if (x >= 0 && x < CANVAS_SIZE_X && y >= 0 && y < CANVAS_SIZE_Y) {
        //
        let dataToReturn = mainComp.layers[activeLayers[activeLayers.length - 1]].pixelData[x][y];
        return "rgb(" + dataToReturn.r + ", " + dataToReturn.g + ", " + dataToReturn.b + ", " + dataToReturn.a + ")";
    }
    return false;
}

export function getActualColorAtLayerCoord(mainComp, activeLayers, x, y) {
    if (x >= 0 && x < CANVAS_SIZE_X && y >= 0 && y < CANVAS_SIZE_Y) {
      return mainComp.layers[activeLayers[activeLayers.length-1]].pixelData[x][y];
    }
    return false;
  }

// this overwrites the contents of the given layers and replaces them with the specified color
// it also doesn't redraw the canvas
export function updateLayersWithColor(mainComp, activeLayers, r, g, b, a) {
    for (let x = 0; x < CANVAS_SIZE_X; x++) {
        for (let y = 0; y < CANVAS_SIZE_Y; y++) {
            for (let ii = 0; ii < activeLayers.length; ii++) {
                let ind = activeLayers[ii];
                mainComp.layers[ind].pixelData[x][y].r = r;
                mainComp.layers[ind].pixelData[x][y].g = g;
                mainComp.layers[ind].pixelData[x][y].b = b;
                mainComp.layers[ind].pixelData[x][y].a = a;
            }
        }
    }
}