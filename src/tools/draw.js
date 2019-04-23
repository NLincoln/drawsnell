import {
    CANVAS_SIZE_X,
    CANVAS_SIZE_Y
} from "../canvasHelpers";

// this updates the values of layers but does not redraw the canvas!
export default function draw(
    mainComp,
    activeLayers,
    x,
    y,
    r,
    g,
    b,
    a,
    radius
) {
    if (x >= 0 && x < CANVAS_SIZE_X && y >= 0 && y < CANVAS_SIZE_Y) {
        // Fills in tiles in a specific radius around the central point.
        for (let curY = y - (radius - 1); curY < y + radius; curY++) {
            // Skips the y value if it is out of the bounds of the canvas.
            if (curY < 0 || curY >= CANVAS_SIZE_Y)
                continue;

            for (let curX = x - (radius - 1); curX < x + radius; curX++) {
                // Skips the pixel if it is out of the bounds of the canvas.
                if (curX < 0 || curX >= CANVAS_SIZE_X)
                    continue;

                // need to get the actual color somehow!
                for (let ii = 0; ii < activeLayers.length; ii++) {
                    let ind = activeLayers[ii];
                    mainComp.layers[ind].pixelData[curX][curY].r = r;
                    mainComp.layers[ind].pixelData[curX][curY].g = g;
                    mainComp.layers[ind].pixelData[curX][curY].b = b;
                    mainComp.layers[ind].pixelData[curX][curY].a = a;
                }
            }
        }
    }
}