import React, {
  useEffect,
  useRef,
  useState
} from "react";

// Imports all the tool functions from their files.
import bresenham from "./tools/bresenham";
import brush from "./tools/brush";
import calligraphy from "./tools/calligraphy";
import draw from "./tools/draw";
import fill from "./tools/fill";
import question from "./tools/question";
import sprinkle from "./tools/sprinkle";

import {
  TOOLS
} from "./tools/tools";

// Imports the helper functions for the canvas.
import {
  CANVAS_SIZE_X,
  CANVAS_SIZE_Y,
  TILE_SIZE,
  getPixelCoordsOfEvent,
  updateLayersWithColor
} from "./canvasHelpers";

// Uses the specified tool on the composition's currently active layers.
function useTool(tool, comp, activeLayers, point, radius, color) {
  switch (tool) {
    case TOOLS.erase:
      draw(comp, activeLayers, point.x, point.y, 255, 255, 255, 0, radius);
      break;
    case TOOLS.draw:
      draw(comp, activeLayers, point.x, point.y, color.r, color.g, color.b, color.a, radius);
      break;
    case TOOLS.questionTool:
      question(comp, activeLayers, point.x, point.y, color.r, color.g, color.b, color.a, radius);
      break;
    case TOOLS.calligBrush:
      calligraphy(comp, activeLayers, point.x, point.y, color.r, color.g, color.b, color.a, radius);
      break;
    case TOOLS.sprinkle:
      sprinkle(comp, activeLayers, point.x, point.y, color.r, color.g, color.b, color.a, radius);
      break;
    case TOOLS.brush:
      brush(comp, activeLayers, point.x, point.y, color.r, color.g, color.b, color.a, radius);
      break;
    default:
      break;
  }
}

/**
 * @param {MouseEvent} event
 * @param {MouseEvent|null} prevEvent
 * @param {HTMLCanvasElement} canvas
 * @param {string} tool
 */
function drawOnCanvas(event, prevEvent, tool, mainComp, activeLayers, drawColor, radius) {
  let position = getPixelCoordsOfEvent(event);
  // let ctx = canvas.getContext("2d");
  if (prevEvent) {
    let prevPosition = getPixelCoordsOfEvent(prevEvent);

    // If the cursor has not moved to a different pixel from the last event, then don't do anything.
    if (position.x === prevPosition.x && position.y === prevPosition.y)
      return;

    let pointsToFill = bresenham(prevPosition, position);
    for (let point of pointsToFill)
      useTool(tool, mainComp, activeLayers, point, radius, drawColor);

  } else {
    useTool(tool, mainComp, activeLayers, position, radius, drawColor);
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


/**
 * Draws a line from the given startPosition to the coord in the
 * given event.
 *
 * @param {MouseEvent} event
 * @param {*} mainComp
 * @param {*} activeLayers
 * @param {*} drawColor
 * @param {*} radius
 * @param {*} startPosition
 */
function lineFill(event, mainComp, activeLayers, drawColor, radius, startPosition) {
  if (!startPosition)
    return;

  let position = getPixelCoordsOfEvent(event);
  let pointsToFill = bresenham(startPosition, position);

  for (let point of pointsToFill)
    draw(mainComp, activeLayers, point.x, point.y, drawColor.r, drawColor.g, drawColor.b, drawColor.a, radius);
}

function usePseudoCanvas({ currentTool, mainComp, activeLayers, drawColor, radius }) {
  let realCanvasRef = useRef(null);
  let [selection, setSelection] = useState(null);
  let [preview, setPreview] = useState(null);
  let previousMouseEvent = useRef(null);
  let [isDragging, setIsDragging] = useState(false);
  let [startPosition, setStartPosition] = useState(false);

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

          if (preview)
            this.clearPreview();

          if (startPosition)
            setStartPosition(false);

          switch (currentTool) {
            case TOOLS.select:
              this.beginSelection(event);
              break;
            case TOOLS.fill:
              this.fillEvent(event, mainComp, activeLayers, drawColor);
              break;
            case TOOLS.line:
              this.beginLine(event);
              this.setStartPositionCoordEvent(event);
              break;
            case TOOLS.continuousLine:
              this.beginLine(event);
              this.drawContinuousLineEvent(event, mainComp, activeLayers, drawColor, radius);
              break;
            case TOOLS.rectangle:
              this.beginRect(event);
              this.setStartPositionCoordEvent(event);
              break;
            case TOOLS.ellipse:
              break;
            default:
              this.drawEvent(event, null, currentTool, mainComp, activeLayers, drawColor, radius);
              break;
          }
        },

        onDoubleClick: () => {
          setStartPosition(false);
          this.clearPreview();
        },

        onMouseMove: event => {
          if (currentTool === TOOLS.continuousLine && startPosition)
            this.adjustLine(event);

          if (!isDragging)
            return;

          switch (currentTool) {
            case TOOLS.select:
              this.adjustSelection(event);
              break;
            case TOOLS.line:
              this.adjustLine(event);
              break;
            case TOOLS.rectangle:
              this.adjustRect(event);
              break;
            default:
              this.drawEvent(event, previousMouseEvent.current, currentTool, mainComp, activeLayers, drawColor, radius);
              break;
          }

          event.persist();
          previousMouseEvent.current = event;
        },

        onMouseUp: event => {
          setIsDragging(false);
          previousMouseEvent.current = null;

          switch (currentTool) {
            case TOOLS.line:
              this.lineDrawEvent(event, mainComp, activeLayers, drawColor, radius);
              this.clearPreview();
              break;
            case TOOLS.rectangle:
              this.applyRect(event, mainComp, activeLayers, drawColor, radius);
              this.clearPreview();
              break;
            default:
              break;
          }
        }
      };
    },

    /**
     * Draw on both canvases using the mouse events
     * @param {MouseEvent} event
     * @param {MouseEvent} prevEvent
     * @param {string} tool
     */
    drawEvent(event, prevEvent, tool, mainComp, activeLayers, drawColor, radius) {
      this.interact(() =>
        drawOnCanvas(event, prevEvent, tool, mainComp, activeLayers, drawColor, radius)
      );

      this.compositeLayersForAllPixels(mainComp); // actually make all the changes to the layer visible
    },

    // Draws a continous line.
    // Note: will only begin drawing a continuous line on the second call to the function
    // as two coordinates are needed to draw a 2d line.
    drawContinuousLineEvent(event, mainComp, activeLayers, drawColor, radius) {
      if (startPosition) {
        //if startPosition is set, draw a line
        this.interact(() =>
          lineFill(event, mainComp, activeLayers, drawColor, radius, startPosition)
        );

        this.compositeLayersForAllPixels(mainComp);//actually update the pixels on the visible layer
        setStartPosition(getPixelCoordsOfEvent(event));
      } else {
        //set the starting position
        setStartPosition(getPixelCoordsOfEvent(event));
      }
    },

    // Sets the starting position variable with a coord for use in drawing a line
    setStartPositionCoordEvent(event) {
      setStartPosition(getPixelCoordsOfEvent(event));
    },

    // Draws a line.
    // Warning: assumes the variable "startPosition" is set
    lineDrawEvent(event, mainComp, activeLayers, drawColor, radius) {
      if (!startPosition)
        return;

      this.interact(canvas => lineFill(event, mainComp, activeLayers, drawColor, radius, startPosition));
      this.compositeLayersForAllPixels(mainComp);//actually update the pixels on the visible layer
      setStartPosition(false);//unset start position
    },

    fillEvent(event, mainComp, activeLayers, fillColor) {
      this.interact(canvas => fill(event, canvas, mainComp, activeLayers, fillColor));
      this.compositeLayersForAllPixels(mainComp);
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

    // Returns the current preview, or none if there is noting being currently previewed.
    preview() {
      return preview;
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
    },

    // Begins previewing a line.
    beginLine(event) {
      let position = getPixelCoordsOfEvent(event);
      setPreview({
        origin: position,
        destination: position,
        radius: radius,
        tool: TOOLS.line
      });
    },

    // Updates the currently previewed line.
    adjustLine(event) {
      let position = getPixelCoordsOfEvent(event);
      setPreview(prev => ({
        origin: prev.origin,
        destination: position,
        radius: radius,
        tool: TOOLS.line
      }));
    },

    // Begins previewing a rectangle.
    beginRect(event) {
      let position = getPixelCoordsOfEvent(event);
      setPreview({
        origin: position,
        destination: position,
        radius: radius,
        tool: TOOLS.rectangle
      });
    },

    // Updates the currently previewed rectangle.
    adjustRect(event) {
      let position = getPixelCoordsOfEvent(event);
      setPreview(prev => ({
        origin: prev.origin,
        destination: position,
        radius: radius,
        tool: TOOLS.rectangle
      }));
    },

    // Draws a rectangle on the canvas based on the starting and ending positions.
    applyRect(event, mainComp, activeLayers, drawColor, radius) {
      if (!startPosition)
        return;

      let position = getPixelCoordsOfEvent(event);

      // Gets the positions of each side of the rectangle.
      let top = Math.min(startPosition.y - radius + 1, position.y - radius + 1);
      let bottom = top + Math.abs(startPosition.y - position.y) + 2 * radius - 2;
      let left = Math.min(startPosition.x - radius + 1, position.x - radius + 1);
      let right = left + Math.abs(startPosition.x - position.x) + 2 * radius - 2;

      // Gets the positions of the inner area of the rectangle.
      let inner_top = null;
      let inner_bottom = null;
      let inner_left = null;
      let inner_right = null;

      // Checks if the rectangle is big enough to need to have an inner area.
      let inner = false;

      if (right - left > radius * 2 - 1 && bottom - top > radius * 2 - 1) {
        inner_top = top + radius;
        inner_bottom = bottom - radius;
        inner_left = left + radius;
        inner_right = right - radius;
        inner = true;
      }

      // Draws the rectangle on the canvas.
      for (let x = left; x <= right; x++)
        for (let y = top; y <= bottom; y++)
          if (!inner || (x < inner_left || x > inner_right || y < inner_top || y > inner_bottom))
            draw(mainComp, activeLayers, x, y, drawColor.r, drawColor.g, drawColor.b, drawColor.a, 1);

      // Updates the canvas with the rectangle.
      this.compositeLayersForAllPixels(mainComp);

      // Unsets the starting position.
      setStartPosition(false);
    },

    // Clears the preview.
    clearPreview() {
      setPreview(null);
    }
  }
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

  if (xIsOdd)
    if (yIsOdd)
      return COLOR_A;
    else
      return COLOR_B;
  else
    if (yIsOdd)
      return COLOR_B;
    else
      return COLOR_A;
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
    let width = Math.abs(origin.x - destination.x) + 1;
    let height = Math.abs(origin.y - destination.y) + 1;
    let top = Math.min(origin.y, destination.y);
    let left = Math.min(origin.x, destination.x);
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    // So strokeRect exists, but the selection is slightly off.
    // instead, I'm going to do this the hacky way: fill a black rectangle
    // then clear the inside
    ctx.fillRect(left, top, width, height);
    if (width > 2 && height > 2)
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

function PreviewCanvas(props) {
  let { preview, canvas } = props;
  let ref = useRef(null);
  let { origin, destination, radius, tool } = preview;
  let drawColor = props.drawColor;

  React.useLayoutEffect(() => {
    let canvas = ref.current;
    let ctx = canvas.getContext("2d");
    ctx.scale(TILE_SIZE, TILE_SIZE);
  }, []);

  React.useLayoutEffect(() => {
    let canvas = ref.current;
    let ctx = canvas.getContext("2d");

    // Sets the fill color to whatever is currently selected for the main canvas.
    ctx.fillStyle = `rgba(${drawColor.r},${drawColor.g}, ${drawColor.b}, ${drawColor.a})`;

    // Clears the preview canvas, since we are about to draw new stuff.
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    switch (tool) {
      case TOOLS.line:
        let pointsToFill = bresenham(origin, destination);

        for (let point of pointsToFill)
          ctx.fillRect(point.x - radius + 1, point.y - radius + 1, radius * 2 - 1, radius * 2 - 1)

        break;

      case TOOLS.rectangle:
        // Gets the coordinates of the outer rectangle.
        let width = Math.abs(origin.x - destination.x) + 2 * radius - 1;
        let height = Math.abs(origin.y - destination.y) + 2 * radius - 1;
        let top = Math.min(origin.y - radius + 1, destination.y - radius + 1);
        let left = Math.min(origin.x - radius + 1, destination.x - radius + 1);

        ctx.fillRect(left, top, width, height);

        // Removes space in the center based on the specifications.
        if (width > radius * 2 - 1 && height > radius * 2 - 1)
          ctx.clearRect(left + radius, top + radius, width - 2 * radius, height - 2 * radius);

        break;

      default:
        break;
    }
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
    radius: props.radius,
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

  let preview = canvas.preview();

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
        {preview && <PreviewCanvas canvas={canvas} preview={preview} drawColor={props.drawColor} />}
      </div>
    </>
  );
}