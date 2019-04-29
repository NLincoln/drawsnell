import {
    CANVAS_SIZE_X,
    CANVAS_SIZE_Y
} from "../canvasHelpers"

// This updates the values of layers for the brush tool.
// Does not redraw the canvas!
export default function brush(
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

                // find distance pixel is from epicenter(given x and y)
                let distanceFromCenter = Math.abs(y - curY) + Math.abs(x - curX);
                // find percantage pixel should be the targ color based on the distance
                let percentTargColor = 1 - distanceFromCenter / (radius + radius - 1);

                // need to get the actual color somehow!
                for (let ii = 0; ii < activeLayers.length; ii++) {
                    let ind = activeLayers[ii];
                    let differenceR = r - mainComp.layers[ind].pixelData[curX][curY].r;
                    let differenceG = g - mainComp.layers[ind].pixelData[curX][curY].g;
                    let differenceB = b - mainComp.layers[ind].pixelData[curX][curY].b;
                    let differenceA = a - mainComp.layers[ind].pixelData[curX][curY].a;

                    mainComp.layers[ind].pixelData[curX][curY].r = Math.trunc(mainComp.layers[ind].pixelData[curX][curY].r + (differenceR * percentTargColor));
                    mainComp.layers[ind].pixelData[curX][curY].g = Math.trunc(mainComp.layers[ind].pixelData[curX][curY].g + (differenceG * percentTargColor));
                    mainComp.layers[ind].pixelData[curX][curY].b = Math.trunc(mainComp.layers[ind].pixelData[curX][curY].b + (differenceB * percentTargColor));
                    mainComp.layers[ind].pixelData[curX][curY].a = mainComp.layers[ind].pixelData[curX][curY].a + (differenceA * percentTargColor);
                }
            }
        }
    }
}