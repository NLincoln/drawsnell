import React, { useEffect, useRef, useState } from "react";
import bresenham from "./bresenham";

const CANVAS_SIZE = 40; // 40 "fake" pixels
const TILE_SIZE = 16; // each "fake" pixel is 64x64 real pixels

function getPositionOfEventOnElement(event) {
  let boundingRect = event.target.getBoundingClientRect();

  return {
    x: event.clientX - boundingRect.left,
    y: event.clientY - boundingRect.top
  };
}

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
      ctx.fillRect(point.x, point.y, 1, 1);
    }
  } else {
    ctx.fillRect(position.x, position.y, 1, 1);
  }
}

function Canvas(props) {
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
    ctx.fillStyle = "black";
  }, []); // only run this once

  return (
    <>
      <div>
        <canvas
          style={{ border: "2px solid black", margin: 20 }}
          width={String(CANVAS_SIZE * TILE_SIZE)}
          height={String(CANVAS_SIZE * TILE_SIZE)}
          ref={canvasRef}
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
        />
      </div>
    </>
  );
}

export default function App() {
  return <Canvas />;
}
