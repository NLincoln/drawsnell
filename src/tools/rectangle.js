export default function rectangle(start, end) {
  let rectanglePoints = [];

  // Gets the positions of each side of the rectangle.
  let top = Math.min(start.y, end.y);
  let bottom = Math.max(start.y, end.y);
  let left = Math.min(start.x, end.x);
  let right = Math.max(start.x, end.x);

  // Draws the rectangle on the canvas.
  for (let x = left; x <= right; x++)
    for (let y = top; y <= bottom; y++)
      if (x === left || x === right || y === top || y === bottom)
        rectanglePoints.push({ x: x, y: y });

  return rectanglePoints;
}
