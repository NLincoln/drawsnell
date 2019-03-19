import React, {
  useEffect,
  useRef,
  useState
} from "react";
import bresenham from "./bresenham";
import {
  TOOLS
} from "./tools";

const CANVAS_SIZE_X = 40; // 40 "fake" pixels
const CANVAS_SIZE_Y = 40; // 40 "fake" pixels
const TILE_SIZE = 16; // each "fake" pixel is 64x64 real pixels

/**
 * So normal events have two things:
 * 1. Where the event occurred _on the page_
 * 2. What element the event occurred on
 * We can use those two pieces of information to get
 * where the event occurred on the element it was triggered
 * on
 * @param {MouseEvent} event
 */
function getPositionOfEventOnElement(event) {
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
 * Given the coordinates that an event occurred on the
 * canvas, find out what the corresponding coordinates
 * in "pixel" space are.
 * @param {{ x: number, y: number }} param
 */
function getPixelCoordsInCanvas({
  x,
  y
}) {
  return {
    x: Math.floor(x / TILE_SIZE),
    y: Math.floor(y / TILE_SIZE)
  };
}

/**
 * Shorthand for getPositionOfEventOnElement > getPixelCoordsInCanvas
 * @param {MouseEvent} event
 */
function getPixelCoordsOfEvent(event) {
  return getPixelCoordsInCanvas(getPositionOfEventOnElement(event));
}

function fillTool(event, canvas, mainComp, activeLayers, fillColor) {
  let position = getPositionOfEventOnElement(event);
  position = getPixelCoordsInCanvas(position);

  let pixelStack = [[position.x, position.y]];
  let color = getColorAtLayerCoord(mainComp, activeLayers, position.x, position.y);
  let canvasWidth = canvas.width / TILE_SIZE;
  let canvasHeight = canvas.height / TILE_SIZE;
  let pseudoFillColor = "rgb(" + fillColor.r + ", " + fillColor.g +
    ", " + fillColor.b + ", " + fillColor.a + ")";
  let leftFill, rightFill;
  while (pixelStack.length && color !== pseudoFillColor) {
    let newPos = pixelStack.pop();
    let newX = newPos[0];
    let newY = newPos[1];
    let currentTileColor = getColorAtLayerCoord(mainComp, activeLayers, newX, newY);
    while (newY >= 0 && currentTileColor === color) {
      if (newY >= 0)
        currentTileColor = getColorAtLayerCoord(mainComp, activeLayers, newX, newY);

      newY -= 1;
    }

    if (newY < 0)
      newY = 0;
    else
      newY += 2;

    currentTileColor = getColorAtLayerCoord(mainComp, activeLayers, newX, newY);
    leftFill = false;
    rightFill = false;

    while (newY <= canvasHeight - 1 && color !== pseudoFillColor && currentTileColor === color) {
      updateLayersAtCoordWithColor(mainComp, activeLayers, newX, newY, fillColor.r, fillColor.g, fillColor.b, fillColor.a, 1);

      // Checking left tiles
      if (newX > 0) {

        // Check to see if left tile is color that needs to be filled
        let checkLeft = (getColorAtLayerCoord(mainComp, activeLayers, newX - 1, newY));
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
        let checkRight = getColorAtLayerCoord(mainComp, activeLayers, newX + 1, newY);
        if (checkRight === color) {
          // If that column is not marked for filling
          if (!rightFill) {
            pixelStack.push([newX + 1, newY]);
            rightFill = true;
          }
        }
        else if (rightFill) {
          rightFill = false;
        }
      }
      newY++;
      if (newY < canvasHeight)
        currentTileColor = getColorAtLayerCoord(mainComp, activeLayers, newX, newY);

    } // End fill while
  } // End stack popping while
} // End fillTool

// this updates the values of layers but does not redraw the canvas!
function updateLayersAtCoordWithColor(
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

// This returns the color at a specific pixel
function getColorAtLayerCoord(mainComp, activeLayers, x, y) {
  // Ensure all active layers share the same color at this point
  let firstLayerData = mainComp.layers[activeLayers[0]].pixelData[x][y];
  let dataToReturn;
  if (x >= 0 && x < CANVAS_SIZE_X && y >= 0 && y < CANVAS_SIZE_Y) {
    //
    for (let ii = 0; ii < activeLayers.length; ii++) {
      let ind = activeLayers[ii];
      dataToReturn = mainComp.layers[ind].pixelData[x][y];
      if (dataToReturn !== firstLayerData) {
        return false;
      }
    }
  }
  return "rgb(" + dataToReturn.r + ", " + dataToReturn.g + ", " + dataToReturn.b + ", " + dataToReturn.a + ")";
}

// this overwrites the contents of the given layers and replaces them with the specified color
// it also doesn't redraw the canvas
function updateLayersWithColor(mainComp, activeLayers, r, g, b, a) {
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

/**
 * @param {MouseEvent} event
 * @param {MouseEvent|null} prevEvent
 * @param {HTMLCanvasElement} canvas
 * @param {string} tool
 */
function drawOnCanvas(
  event,
  prevEvent,
  canvas,
  tool,
  mainComp,
  activeLayers,
  drawColor,
  radius
) {
  let position = getPixelCoordsOfEvent(event);
  // let ctx = canvas.getContext("2d");
  if (prevEvent) {
    let prevPosition = getPixelCoordsOfEvent(prevEvent);

    let pointsToFill = bresenham(prevPosition, position);
    for (let point of pointsToFill) {
      if (tool === TOOLS.erase) {
        updateLayersAtCoordWithColor(
          mainComp,
          activeLayers,
          point.x,
          point.y,
          255,
          255,
          255,
          0,
          radius
        );
      } else if (tool === TOOLS.draw) {
        updateLayersAtCoordWithColor(
          mainComp,
          activeLayers,
          point.x,
          point.y,
          drawColor.r,
          drawColor.g,
          drawColor.b,
          drawColor.a,
          radius
        );
      }
    }
  } else {
    if (tool === TOOLS.erase) {
      updateLayersAtCoordWithColor(
        mainComp,
        activeLayers,
        position.x,
        position.y,
        255,
        255,
        255,
        0,
        radius
      );
    } else if (tool === TOOLS.draw) {
      updateLayersAtCoordWithColor(
        mainComp,
        activeLayers,
        position.x,
        position.y,
        drawColor.r,
        drawColor.g,
        drawColor.b,
        drawColor.a,
        radius
      );
    }
  }
}

function useScaleCanvas(ref) {
  React.useLayoutEffect(() => {
    let canvas = ref.current;
    let ctx = canvas.getContext("2d");
    ctx.scale(TILE_SIZE, TILE_SIZE);
  }, []);
}

function TileCanvas(props) {
  let { dimensions } = props;

  let ref = useRef(null);
  useScaleCanvas(ref);

  React.useLayoutEffect(() => {
    let ctx = ref.current.getContext("2d");
    for (let y = 0; y < dimensions.height; ++y) {
      for (let x = 0; x < dimensions.width; ++x) {
        ctx.fillStyle = getBackgroundColorForPixel({ x, y });
        ctx.fillRect(x, y, 1, 1);
      }
    }
  }, [dimensions]);

  return (
    <canvas
      ref={ref}
      style={{
        border: "2px solid black",
        position: "absolute",
        zIndex: "1"
      }}
      width={String(dimensions.width * TILE_SIZE)}
      height={String(dimensions.height * TILE_SIZE)}
    />
  );
}


function usePseudoCanvas({ currentTool, mainComp, activeLayers, drawColor, radius }) {
  let realCanvasRef = useRef(null);
  let [selection, setSelection] = useState(null);
  let previousMouseEvent = useRef(null);
  let [isDragging, setIsDragging] = useState(false);

  return {
    ref: realCanvasRef,
    real() {
      return realCanvasRef.current;
    },

    eventHandlers() {
      return {
        onMouseDown: event => {
          setIsDragging(true);
          event.persist();
          previousMouseEvent.current = event;
          if (currentTool === TOOLS.select) {
            this.beginSelection(event);
          } else if (currentTool === TOOLS.fill) {
            this.fillEvent(event, mainComp, activeLayers, drawColor);
          } else {
            this.drawEvent(
              event,
              null,
              currentTool,
              mainComp,
              activeLayers,
              drawColor,
              radius
            );
          }
        },
        onMouseMove: event => {
          if (!isDragging) {
            return;
          }
          if (currentTool === TOOLS.select) {
            this.adjustSelection(event);
          } else {
            this.drawEvent(
              event,
              previousMouseEvent.current,
              currentTool,
              mainComp,
              activeLayers,
              drawColor,
              radius
            );
          }
          event.persist();
          previousMouseEvent.current = event;
        },
        onMouseUp: event => {
          setIsDragging(false);
          previousMouseEvent.current = null;
        },
        onMouseLeave: event => { }
      };
    },

    /**
     * Draw on both canvases using the mouse events
     * @param {MouseEvent} event
     * @param {MouseEvent} prevEvent
     * @param {string} tool
     */
    drawEvent(event, prevEvent, tool, mainComp, activeLayers, drawColor, radius) {
      this.interact(canvas =>
        drawOnCanvas(
          event,
          prevEvent,
          canvas,
          tool,
          mainComp,
          activeLayers,
          drawColor,
          radius
        )
      );
      this.compositeLayersForAllPixels(mainComp); // actually make all the changes to the layer visible
    },

    fillEvent(event, mainComp, activeLayers, fillColor) {
      this.interact(canvas => fillTool(event, canvas, mainComp, activeLayers, fillColor));
      this.compositeLayersForAllPixels(mainComp);
    },

    /**
     * Draws the color of a single pixel on the canvas
     */
    draw({
      x,
      y
    }) {
      this.interact(canvas => {
        let ctx = canvas.getContext("2d");
        ctx.fillRect(x, y, 1, 1);
      });
    },

    /**
     * Sets the color of both canvases
     * @param {string} color
     */
    setColor(color) {
      this.interact(canvas => {
        let ctx = canvas.getContext("2d");
        ctx.fillStyle = color;
      });
    },

    /* Fills the canvas with the current contents of the layer structure */
    compositeLayersForAllPixels(mainComp) {
      // window.alert("called composite all layers!");
      this.interact(canvas => {
        let ctx = canvas.getContext("2d");
        let oldColor = ctx.fillStyle;
        let myLayer = mainComp.getComposite();
        for (let yy = 0; yy < CANVAS_SIZE_Y; ++yy) {
          for (let xx = 0; xx < CANVAS_SIZE_X; ++xx) {
            let rr = myLayer.pixelData[xx][yy].r;
            let gg = myLayer.pixelData[xx][yy].g;
            let bb = myLayer.pixelData[xx][yy].b;
            let aa = myLayer.pixelData[xx][yy].a;
            // ctx.fillStyle = getBackgroundColorForPixel({ xx, yy });
            ctx.fillStyle = `rgba(${rr}, ${gg}, ${bb}, ${aa})`;
            ctx.clearRect(xx, yy, 1, 1);
            ctx.fillRect(xx, yy, 1, 1);
          }
        }
        ctx.fillStyle = oldColor;
      });
    },



    /* clears the activeLayers to be transparent pixels RGBA(255, 255, 255, 0.0) */
    clearActiveLayers(mainComp, activeLayers) {
      updateLayersWithColor(mainComp, activeLayers, 255, 255, 255, 0);
    },
    /**
     * Interact with both canvases imperatively. You must provide a
     * callback that can handle both the fake canvas and the real one.
     *
     * This is a fairly low-level api.
     */
    interact(cb) {
      cb(realCanvasRef.current);
    },

    /**
     * Returns the current selection,
     * or none if there isn't anything selected.
     */
    selection() {
      return selection;
    },

    /**
     *
     * @param {MouseEvent} event
     */
    beginSelection(event) {
      let position = getPixelCoordsOfEvent(event);
      setSelection({
        origin: position,
        destination: position
      });
    },

    adjustSelection(event) {
      let position = getPixelCoordsOfEvent(event);
      setSelection(prev => ({
        origin: prev.origin,
        destination: position
      }));
    }
  };
}

/**
 * Our canvas should have a transparent background. This function
 * will return what the background color should be for a given
 * pixel on the canvas.
 */
function getBackgroundColorForPixel({ x, y }) {
  let COLOR_A = "gainsboro";
  let COLOR_B = "silver";
  let xIsOdd = x % 2 === 1;
  let yIsOdd = y % 2 === 1;
  if (xIsOdd) {
    if (yIsOdd) {
      return COLOR_A;
    } else {
      return COLOR_B;
    }
  } else {
    if (yIsOdd) {
      return COLOR_B;
    } else {
      return COLOR_A;
    }
  }
}

function SelectedCanvas(props) {
  // really just returns a canvas that is transparent save for a box detailing
  // the selection
  let { selection, canvas } = props;
  let ref = useRef(null);
  let { origin, destination } = selection;

  React.useLayoutEffect(() => {
    let canvas = ref.current;
    let ctx = canvas.getContext("2d");
    ctx.scale(TILE_SIZE, TILE_SIZE);
  }, []);

  React.useLayoutEffect(() => {
    let canvas = ref.current;
    let ctx = canvas.getContext("2d");
    ctx.fillStyle = "black";
    let width = Math.abs(origin.x - destination.x);
    let height = Math.abs(origin.y - destination.y);
    let top = Math.min(origin.y, destination.y);
    let left = Math.min(origin.x, destination.x);
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    // So strokeRect exists, but the selection is slightly off.
    // instead, I'm going to do this the hacky way: fill a black rectangle
    // then clear the inside
    ctx.fillRect(left, top, width, height);
    ctx.clearRect(left + 1, top + 1, width - 2, height - 2);
  }, [origin, destination]);

  return (
    <canvas
      ref={ref}
      width={String(CANVAS_SIZE_X * TILE_SIZE)}
      height={String(CANVAS_SIZE_Y * TILE_SIZE)}
      style={{
        border: "2px solid black",
        position: "absolute",
        zIndex: "2"
      }}
      {...canvas.eventHandlers()}
    />
  );
}

export default function Canvas(props) {
  let canvas = usePseudoCanvas({
    currentTool: props.currentTool,
    mainComp: props.mainComp,
    activeLayers: props.activeLayers,
    drawColor: props.drawColor,
    radius: props.radius
  });


  useEffect(() => {
    canvas.interact(canvas => {
      let ctx = canvas.getContext("2d");
      ctx.scale(TILE_SIZE, TILE_SIZE);
    });
  }, []);

  ///////////////////////////////////////////
  //// code for one-time only events ////////
  ///////////////////////////////////////////
  if (props.oneTimeEvent != null) {
    // let ctx = canvas.real().getContext("2d"); // just for reference in case we need it, this works
    if (props.oneTimeEvent === "redrawCanvas") {
      canvas.compositeLayersForAllPixels(props.mainComp);
    } else if (props.oneTimeEvent === "clearActiveLayers") {
      updateLayersWithColor(
        props.mainComp,
        props.activeLayers,
        255,
        255,
        255,
        0
      );
      canvas.compositeLayersForAllPixels(props.mainComp);
    }
    props.changeOneTimeEvent(null);
  }
  ///////////////////////////////////////////
  //// end code for one-time only events ////
  ///////////////////////////////////////////

  useEffect(() => {
    let { drawColor } = props;
    canvas.setColor(
      `rgba(${drawColor.r},${drawColor.g}, ${drawColor.b}, ${drawColor.a})`
    );
  }, [props.drawColor]);

  let selection = canvas.selection();

  useEffect(() => {
    canvas.setColor(props.drawcolor);
  }, [props.drawcolor]);

  return (
    <>
      <div style={{ position: "relative" }}>
        <TileCanvas
          dimensions={{
            width: CANVAS_SIZE_X,
            height: CANVAS_SIZE_Y
          }}
        />
        <canvas
          id={"canvas"}
          width={String(CANVAS_SIZE_X * TILE_SIZE)}
          height={String(CANVAS_SIZE_Y * TILE_SIZE)}
          style={{
            border: "2px solid black",
            position: "absolute",
            zIndex: "2"
          }}
          ref={canvas.ref}
          {...canvas.eventHandlers()}
        />
        {selection && <SelectedCanvas canvas={canvas} selection={selection} />}
      </div>
    </>
  );
}
