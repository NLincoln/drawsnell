import {
  TILE_SIZE,
  getPositionOfEventOnElement,
  getPixelCoordsInCanvas,
  getColorAtLayerCoord,
} from "../canvasHelpers";

import draw from "./draw";

export default function fill(event, canvas, mainComp, activeLayers, fillColor) {
  let position = getPositionOfEventOnElement(event);
  position = getPixelCoordsInCanvas(position);

  let pixelStack = [[position.x, position.y]];
  let color = getColorAtLayerCoord(
    mainComp,
    activeLayers,
    position.x,
    position.y,
  );
  let canvasWidth = canvas.width / TILE_SIZE;
  let canvasHeight = canvas.height / TILE_SIZE;
  let pseudoFillColor =
    "rgb(" +
    fillColor.r +
    ", " +
    fillColor.g +
    ", " +
    fillColor.b +
    ", " +
    fillColor.a +
    ")";
  let leftFill, rightFill;
  while (pixelStack.length && color !== pseudoFillColor) {
    let newPos = pixelStack.pop();
    let newX = newPos[0];
    let newY = newPos[1];
    let currentTileColor = getColorAtLayerCoord(
      mainComp,
      activeLayers,
      newX,
      newY,
    );
    while (newY >= 0 && currentTileColor === color) {
      if (newY >= 0)
        currentTileColor = getColorAtLayerCoord(
          mainComp,
          activeLayers,
          newX,
          newY,
        );

      newY -= 1;
    }

    if (newY < 0) newY = 0;
    else newY += 2;

    currentTileColor = getColorAtLayerCoord(mainComp, activeLayers, newX, newY);
    leftFill = false;
    rightFill = false;

    while (
      newY <= canvasHeight - 1 &&
      color !== pseudoFillColor &&
      currentTileColor === color
    ) {
      draw(
        mainComp,
        activeLayers,
        newX,
        newY,
        fillColor.r,
        fillColor.g,
        fillColor.b,
        fillColor.a,
        1,
      );

      // Checking left tiles
      if (newX > 0) {
        // Check to see if left tile is color that needs to be filled
        let checkLeft = getColorAtLayerCoord(
          mainComp,
          activeLayers,
          newX - 1,
          newY,
        );
        if (checkLeft === color) {
          // If that column is not marked for filling
          if (!leftFill) {
            pixelStack.push([newX - 1, newY]);
            leftFill = true;
          }
        }
        // If left pixel not a color to be filled and that column was marked for fililng
        else if (leftFill) {
          leftFill = false;
        }
      }

      // Checking right tiles
      if (newX < canvasWidth - 1) {
        // If the right tile is the color to be filled
        let checkRight = getColorAtLayerCoord(
          mainComp,
          activeLayers,
          newX + 1,
          newY,
        );
        if (checkRight === color) {
          // If that column is not marked for filling
          if (!rightFill) {
            pixelStack.push([newX + 1, newY]);
            rightFill = true;
          }
        } else if (rightFill) {
          rightFill = false;
        }
      }
      newY++;
      if (newY < canvasHeight)
        currentTileColor = getColorAtLayerCoord(
          mainComp,
          activeLayers,
          newX,
          newY,
        );
    } // End fill while
  } // End stack popping while
} // End fillTool
