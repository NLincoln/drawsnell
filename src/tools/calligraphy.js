import bresenham from "./bresenham";
import draw from "./draw";

// This updates the values of layers for the calligraphy brush tool.
// Does not redraw the canvas!
export default function calligraphy(
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
    let pointOffset = Math.trunc(radius / 2);
    let firstPoint = { x: x + pointOffset, y: y + pointOffset };
    let secondPoint = { x: x - pointOffset, y: y - pointOffset };
    let pointsToFill = bresenham(firstPoint, secondPoint);
    for (let point of pointsToFill) {
        draw(
            mainComp,
            activeLayers,
            point.x,
            point.y,
            r,
            g,
            b,
            a,
            1
        );
    }
}