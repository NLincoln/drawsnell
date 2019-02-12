import React, { useEffect, useRef, useState } from "react";
import bresenham from "./bresenham";

const CANVAS_SIZE = 40; // 40 "fake" pixels
const TILE_SIZE = 16; // each "fake" pixel is 64x64 real pixels
const TOOL_LIST = ['draw', 'erase']; // Container for all tools. Add more as we go

var currentTool = TOOL_LIST[0]; // Set current tool to draw

/* We can move these functions to another file if necessary */
///////////////////////////////////////////////////////////////////////////////////////////
function getcolor(R, G, B, A)
{
  return 'rgb(' + R + ', ' + G + ', ' + B + ', ' + A + ')';
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

function drawOnCanvas(event, prevEvent, canvas) {
  let position = getPositionOfEventOnElement(event);
  position = getPixelCoordsInCanvas(position);
  let ctx = canvas.getContext("2d");
  if (prevEvent) {
    let prevPosition = getPositionOfEventOnElement(prevEvent);
    prevPosition = getPixelCoordsInCanvas(prevPosition);

    let pointsToFill = bresenham(prevPosition, position);
    for (let point of pointsToFill) {
      if(currentTool === TOOL_LIST[0]) // Draw
      {
        ctx.fillRect(point.x, point.y, 1, 1);
      }
      else if(currentTool === TOOL_LIST[1]) // Erase
      {
        ctx.clearRect(point.x, point.y, 1, 1);
      }
    }
  } else {
    if(currentTool === TOOL_LIST[0]) // Draw
    {
      ctx.fillRect(position.x, position.y, 1, 1);
    }
    else if(currentTool === TOOL_LIST[1]) // Erase
    {
      ctx.clearRect(position.x, position.y, 1, 1);
    }
  }
}

// Toggle between erase and draw
function toggleErase(canvas)
{
  let ctx = canvas.getContext("2d");
  if(currentTool === TOOL_LIST[1]) // If tool is erase
  {
    currentTool = TOOL_LIST[0]; // Set to draw
  }
  else
  {
    currentTool = TOOL_LIST[1]; // Set to erase
  }
}


export default function Canvas(props) {
  let canvasRef = useRef(null);
  let previousMouseEvent = useRef(null);
  let [isDragging, setIsDragging] = useState(false);



  const handleMouseDown = event => {
    drawOnCanvas(event, null, canvasRef.current);
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
      drawOnCanvas(event, previousMouseEvent.current, canvasRef.current);
      event.persist();
      previousMouseEvent.current = event;
    }
  };

  useEffect(() => {
    let ctx = canvasRef.current.getContext("2d");
    ctx.scale(TILE_SIZE, TILE_SIZE);
    ctx.fillStyle = props.drawcolor; // color you're drawing with
  }, []); // only run this once

  
  return (
    <>
      <div>
        <canvas
          id={"canvas"}
          style={{ border: "2px solid black" }}
          width={String(CANVAS_SIZE * TILE_SIZE)}
          height={String(CANVAS_SIZE * TILE_SIZE)}
          ref={canvasRef}
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
        />
        
        
        
        <button onClick={(e) => toggleErase(canvasRef.current)}>
          Eraser
        </button>



      </div>
    </>
  );
}
