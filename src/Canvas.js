import React, { useEffect, useRef, useState } from "react";
import bresenham from "./bresenham";
import { TOOLS } from "./tools";

const CANVAS_SIZE = 40; // 40 "fake" pixels
const TILE_SIZE = 16; // each "fake" pixel is 64x64 real pixels

/* We can move these functions to another file if necessary */
///////////////////////////////////////////////////////////////////////////////////////////
function getcolor(R, G, B, A) {
  return "rgb(" + R + ", " + G + ", " + B + ", " + A + ")";
}

function getColorFromImageData(imgData)
{
  return getcolor(imgData.data[0], imgData.data[1], 
    imgData.data[2], imgData.data[3]);
}
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

/*
  Needs location of current rectangle.
  First, check to see if rectangle is same color
  as passed color. 
  Second, if it is the same, grab current color in var, then fill 
  rectangle with selected drawcolor.
  Then, calls this function for adjacent rectangles
*/
function fillTool(event, canvas)
{
  let ctx = canvas.getContext("2d");
  let position = getPositionOfEventOnElement(event);
  position = getPixelCoordsInCanvas(position);
  //let ctx = canvas.getContext("2d");
  //let oldColor = tmp.data[0];
  let pixelStack = [[position.x, position.y]]; // x and y coords of clicked location
  let color = getColorFromImageData(ctx.getImageData(position.x*TILE_SIZE, position.y*TILE_SIZE,1,1));
  let canvasWidth = canvas.width / TILE_SIZE;
  let canvasHeight = canvas.height / TILE_SIZE;
/*   console.log("old color is: " + color);
  console.log("startY: " + position.y);
  console.log(canvas.height);
  console.log(canvas.width); */
  while(pixelStack.length)
  {
    console.log("Pixelstack size: "+ pixelStack.length);
    let newPos = pixelStack.pop();
    let newX = newPos[0];
    let newY = newPos[1];
    let locatorY = newY * TILE_SIZE;
    let locatorX = newX * TILE_SIZE;
    let leftFill, rightFill;
    let currentTileColor = getColorFromImageData(ctx.getImageData(locatorX,locatorY,1,1));
    // console.log("pre loop currentTIle: " + currentTileColor);
    while(newY-- >= 0 && currentTileColor===color)
    {
      locatorY -= TILE_SIZE; 
      currentTileColor = getColorFromImageData(ctx.getImageData(locatorX,locatorY,1,1));
      // console.log("in loop currentTile: " + currentTileColor);
    }
    ++newY;
    locatorY += TILE_SIZE;
    currentTileColor = getColorFromImageData(ctx.getImageData(locatorX,locatorY,1,1));
    leftFill = false;
    rightFill = false;

    while(newY++ < canvasHeight-1 && currentTileColor===color)
    {
      currentTileColor = getColorFromImageData(ctx.getImageData(locatorX,locatorY,1,1));
     
      ctx.fillRect(newX, newY, 1, 1);

      // Checking left tiles
      if(newX > 0)
      {
        // Check to see if left tile needs to be filled eventually
        if(getColorFromImageData(ctx.getImageData(locatorX-TILE_SIZE,locatorY,1,1))===color)
        {
          // If that column is not marked for filling
          if(!leftFill)
          {
            pixelStack.push([newX-1,newY]);
            leftFill = true;
          }
        }
        // If left pixel not a color to be filled and that column was marked for fililng
        else if(leftFill)
        {
          leftFill = false;
        }
      }

      // Checking right tiles
      if(newX < canvasWidth-1)
      {
        // If the right tile is the color to be filled
        if(getColorFromImageData(ctx.getImageData(locatorX+TILE_SIZE,locatorY,1,1,)) === color)
        {
          // If that column is not marked for filling
          if(!rightFill)
          {
            pixelStack.push([newX+1,newY]);
            rightFill = true;
          }
        }
        else if(rightFill)
        {
          rightFill = false;
        }
      }

      locatorY += TILE_SIZE;
    } // End fill while
    
    

  } // End main while
} // End fillTool

function drawOnCanvas(event, prevEvent, canvas, tool) {
  let position = getPositionOfEventOnElement(event);
  position = getPixelCoordsInCanvas(position);
  let ctx = canvas.getContext("2d");
  if (prevEvent) {
    let prevPosition = getPositionOfEventOnElement(prevEvent);
    prevPosition = getPixelCoordsInCanvas(prevPosition);

    let pointsToFill = bresenham(prevPosition, position);
    for (let point of pointsToFill) {
      if (tool === TOOLS.erase) {
        drawColorOnCanvasThenRestore(
          ctx,
          point,
          getBackgroundColorForPixel(point)
        );
      } else if (tool === TOOLS.draw) {
        ctx.fillRect(point.x, point.y, 1, 1);
      }
    }
  } else {
    if (tool === TOOLS.erase) {
      drawColorOnCanvasThenRestore(
        ctx,
        position,
        getBackgroundColorForPixel(position)
      );
    } else if (tool === TOOLS.draw) {
      ctx.fillRect(position.x, position.y, 1, 1);
    }
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
    drawEvent(event, prevEvent, tool) {
      this.interact(canvas => drawOnCanvas(event, prevEvent, canvas, tool));
    },

    fillEvent(event)
    {
      this.interact(canvas => fillTool(event, canvas));
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
  let COLOR_A = "grey";
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

export default function Canvas(props) {
  let canvas = usePseudoCanvas();

  let previousMouseEvent = useRef(null);
  let [isDragging, setIsDragging] = useState(false);

  const handleMouseDown = event => {
    if(props.currentTool === TOOLS.fill)
    {
      canvas.fillEvent(event);
    }
    else
    {
      canvas.drawEvent(event, null, props.currentTool);
      setIsDragging(true);
      event.persist();
    }
    /* canvas.drawEvent(event, null, props.currentTool);
    setIsDragging(true);
    event.persist(); */
    previousMouseEvent.current = event;
  };
  const handleMouseUp = event => {
    setIsDragging(false);
    previousMouseEvent.current = null;
  };
  const handleMouseMove = event => {
    if (isDragging) {
      canvas.drawEvent(event, previousMouseEvent.current, props.currentTool);
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

  useEffect(() => {
    let { drawColor } = props;
    canvas.setColor(`rgb(${drawColor.r},${drawColor.g}, ${drawColor.b})`);
  }, [props.drawColor]);

  // draw the transparency grid on the background
  useEffect(() => {
    let ctx = canvas.real().getContext("2d");
    let oldColor = ctx.fillStyle;
    for (let y = 0; y < CANVAS_SIZE; ++y) {
      for (let x = 0; x < CANVAS_SIZE; ++x) {
        ctx.fillStyle = getBackgroundColorForPixel({ x, y });
        ctx.fillRect(x, y, 1, 1);
      }
    }

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
          width={String(CANVAS_SIZE * TILE_SIZE)}
          height={String(CANVAS_SIZE * TILE_SIZE)}
          ref={canvas.fakeRef}
        />

        <canvas
          id={"canvas"}
          style={{ border: "2px solid black" }}
          width={String(CANVAS_SIZE * TILE_SIZE)}
          height={String(CANVAS_SIZE * TILE_SIZE)}
          ref={canvas.ref}
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
        />
      </div>
    </>
  );
}
