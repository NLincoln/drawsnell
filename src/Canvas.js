import React, { useEffect, useRef, useState } from "react";
import bresenham from "./bresenham";
import { TOOLS } from "./tools";

const CANVAS_SIZE_X = 40; // 40 "fake" pixels
const CANVAS_SIZE_Y = 40; // 40 "fake" pixels
const TILE_SIZE = 16; // each "fake" pixel is 64x64 real pixels

///////////////////////////////////////////////////////////////////////////////////////////
// function getcolor(R, G, B, A) {
//   return "rgb(" + R + ", " + G + ", " + B + ", " + A + ")";
// }
///////////////////////////////////////////////////////////////////////////////////////////

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
function getPixelCoordsInCanvas({ x, y }) {
  return {
    x: Math.floor(x / TILE_SIZE),
    y: Math.floor(y / TILE_SIZE)
  };
}

function drawColorOnCanvasThenRestore(context, { x, y }, color) {
  let oldColor = context.fillStyle;
  context.fillStyle = color;
  context.fillRect(x, y, 1, 1);
  context.fillStyle = oldColor;
}

// this updates the values of layers but does not redraw the canvas!
function updateLayersAtCoordWithColor(mainComp, activeLayers, x, y, r, g, b, a)
{
  if(x >= 0 && x < CANVAS_SIZE_X && y >= 0 && y < CANVAS_SIZE_Y)
  {
    // need to get the actual color somehow!
    for(let ii = 0; ii < activeLayers.length; ii++)
    {
      let ind = activeLayers[ii];
      mainComp.layers[ind].pixelData[x][y].r = r;
      mainComp.layers[ind].pixelData[x][y].g = g;
      mainComp.layers[ind].pixelData[x][y].b = b;
      mainComp.layers[ind].pixelData[x][y].a = a;
    }
  }
}

// this overwrites the contents of the given layers and replaces them with the specified color
// it also doesn't redraw the canvas
function updateLayersWithColor(mainComp, activeLayers, r, g, b, a)
{
  for(let x = 0; x < CANVAS_SIZE_X; x++)
  {
    for(let y = 0; y < CANVAS_SIZE_Y; y++)
    {
      for(let ii = 0; ii < activeLayers.length; ii++)
      {
        let ind = activeLayers[ii];
        mainComp.layers[ind].pixelData[x][y].r = r;
        mainComp.layers[ind].pixelData[x][y].g = g;
        mainComp.layers[ind].pixelData[x][y].b = b;
        mainComp.layers[ind].pixelData[x][y].a = a;
      }
    }
  }
}

function drawOnCanvas(event, prevEvent, canvas, tool, mainComp, activeLayers, drawColor) {
  // window.alert(mainComp.layers[0].pixelData[0][0].r);
  let position = getPositionOfEventOnElement(event);
  position = getPixelCoordsInCanvas(position);
  let ctx = canvas.getContext("2d");
  if (prevEvent) {
    let prevPosition = getPositionOfEventOnElement(prevEvent);
    prevPosition = getPixelCoordsInCanvas(prevPosition);

    let pointsToFill = bresenham(prevPosition, position);
    for (let point of pointsToFill) {
      if (tool === TOOLS.erase) 
      {
        updateLayersAtCoordWithColor(mainComp, activeLayers, point.x, point.y, 255, 255, 255, 0);
      } else if (tool === TOOLS.draw) 
      {
        updateLayersAtCoordWithColor(mainComp, activeLayers, point.x, point.y, drawColor.r, drawColor.g, drawColor.b, drawColor.a);
      }
    }
  } 
  else 
  { // what is this doing?
    // if (tool === TOOLS.erase) {
    //   drawColorOnCanvasThenRestore(
    //     ctx,
    //     position,
    //     getBackgroundColorForPixel(position)
    //   );
    // } else if (tool === TOOLS.draw) {
    //   ctx.fillRect(position.x, position.y, 1, 1);
    // }
  }
}

function usePseudoCanvas() {
  let realCanvasRef = useRef(null);
  let fakeCanvasRef = useRef(null);

  return {
    ref: realCanvasRef,
    fakeRef: fakeCanvasRef,

    real() {
      return realCanvasRef.current;
    },
    fake() {
      return fakeCanvasRef.current;
    },

    /**
     * Draw on both canvases using the mouse events
     * @param {MouseEvent} event
     * @param {MouseEvent} prevEvent
     */
    drawEvent(event, prevEvent, tool, mainComp, activeLayers, drawColor) {
      this.interact(canvas => drawOnCanvas(event, prevEvent, canvas, tool, mainComp, activeLayers, drawColor));
      this.compositeLayersForAllPixels(mainComp); // actually make all the changes to the layer visible
    },

    /**
     * Draws the color of a single pixel on the canvas
     */
    draw({ x, y }) {
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
    compositeLayersForAllPixels(mainComp)
    {
      // window.alert("called composite all layers!");
      this.interact(canvas => {
        let ctx = canvas.getContext("2d");
        let oldColor = ctx.fillStyle;
        // window.alert(mainComp.layers[0].pixelData[0][0].r);
        let myLayer = mainComp.getComposite();
        for (let yy = 0; yy < CANVAS_SIZE_Y; ++yy) 
        {
          for (let xx = 0; xx < CANVAS_SIZE_X; ++xx) 
          {
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
    clearActiveLayers(mainComp, activeLayers)
    {
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
      cb(fakeCanvasRef.current);
    }
  };
}

/**
 * Our canvas should have a transparent background. This function
 * will return what the background color should be for a given
 * pixel on the canvas.
 */
function getBackgroundColorForPixel({ x, y }) {
  let COLOR_A = "lightgrey";
  let COLOR_B = "darkgrey";
  let xIsOdd = x % 2 == 1;
  let yIsOdd = y % 2 == 1;
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

function getBackgroundColorForPixelRGBA({ x, y }) {
  let COLOR_A = [211, 211, 211, 1.0];
  let COLOR_B = [169, 169, 169, 1.0];
  let xIsOdd = x % 2 == 1;
  let yIsOdd = y % 2 == 1;
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

export default function Canvas(props) {
  let canvas = usePseudoCanvas();

  let previousMouseEvent = useRef(null);
  let [isDragging, setIsDragging] = useState(false);

  const handleMouseDown = event => {
    canvas.drawEvent(event, null, props.currentTool, props.mainComp, props.activeLayers, props.drawColor);
    setIsDragging(true);
    event.persist();
    previousMouseEvent.current = event;
  };
  const handleMouseUp = event => {
    setIsDragging(false);
    previousMouseEvent.current = null;
  };
  const handleMouseMove = event => {
    if (isDragging) {
      canvas.drawEvent(event, previousMouseEvent.current, props.currentTool, props.mainComp, props.activeLayers, props.drawColor);
      event.persist();
      previousMouseEvent.current = event;
    }
  };
  
  useEffect(() => {
    canvas.interact(canvas => {
      let ctx = canvas.getContext("2d");
      ctx.scale(TILE_SIZE, TILE_SIZE);
    });
  }, []);
  
  ///////////////////////////////////////////
  //// code for one-time only events ////////
  ///////////////////////////////////////////
  if(props.oneTimeEvent != null)
  {
    // let ctx = canvas.real().getContext("2d"); // just for reference in case we need it, this works
    if(props.oneTimeEvent == "redrawCanvas")
    {
      canvas.compositeLayersForAllPixels(props.mainComp);
    }
    else if(props.oneTimeEvent == "clearActiveLayers")
    {
      updateLayersWithColor(props.mainComp, props.activeLayers, 255, 255, 255, 0);
      canvas.compositeLayersForAllPixels(props.mainComp);
    }
    props.changeOneTimeEvent(null);
  }
  ///////////////////////////////////////////
  //// end code for one-time only events ////
  ///////////////////////////////////////////
  
  useEffect(() => {
    let { drawColor } = props;
    canvas.setColor(`rgba(${drawColor.r},${drawColor.g}, ${drawColor.b}, ${drawColor.a})`);
  }, [props.drawColor]);

  // draw the transparency grid on the background (at layer index 0)
  useEffect(() => {
    let ctx = canvas.real().getContext("2d");
    let oldColor = ctx.fillStyle;
    for (let y = 0; y < CANVAS_SIZE_Y; ++y) {
      for (let x = 0; x < CANVAS_SIZE_X; ++x) {
        let gg = getBackgroundColorForPixelRGBA({x, y});
        props.mainComp.layers[0].pixelData[x][y].r = gg[0];
        props.mainComp.layers[0].pixelData[x][y].g = gg[1];
        props.mainComp.layers[0].pixelData[x][y].b = gg[2];
        props.mainComp.layers[0].pixelData[x][y].a = gg[3];
      }
    }
    canvas.compositeLayersForAllPixels(props.mainComp);
    ctx.fillStyle = oldColor;
  }, []);

  return (
    <>
      <div>
        <canvas id={"hidden-canvas"} hidden={true} ref={canvas.fakeRef} />
        <canvas
          hidden={true}
          id={"hidden-canvas"}
          style={{ border: "2px solid black" }}
          width={String(CANVAS_SIZE_X * TILE_SIZE)}
          height={String(CANVAS_SIZE_Y * TILE_SIZE)}
          ref={canvas.fakeRef}
        />

        <canvas
          id={"canvas"}
          style={{ border: "2px solid black" }}
          width={String(CANVAS_SIZE_X * TILE_SIZE)}
          height={String(CANVAS_SIZE_Y * TILE_SIZE)}
          ref={canvas.ref}
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
        />
      </div>
    </>
  );
}
