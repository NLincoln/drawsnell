function range(a, b) {
  let delta = 1;
  if (a > b) {
    delta = -1;
  }
  let result = [];
  while (a !== b) {
    result.push(a);
    a += delta;
  }
  result.push(b);
  return result;
}

// these functions are basically
// 1-1 ports of the code at
// https://en.wikipedia.org/wiki/Bresenham%27s_line_algorithm

function plotLineLow(start, end) {
  let dx = end.x - start.x;
  let dy = end.y - start.y;
  let yi = 1;
  if (dy < 0) {
    yi = -1;
    dy = -dy;
  }
  let d = 2 * dy - dx;
  let y = start.y;
  let result = [];
  for (let x of range(start.x, end.x)) {
    result.push({ x, y });
    if (d > 0) {
      y += yi;
      d -= 2 * dx;
    }
    d += 2 * dy;
  }
  return result;
}

function plotLineHigh(start, end) {
  let dx = end.x - start.x;
  let dy = end.y - start.y;
  let xi = 1;
  if (dx < 0) {
    xi = -1;
    dx = -dx;
  }
  let d = 2 * dx - dy;
  let x = start.x;
  let result = [];
  for (let y of range(start.y, end.y)) {
    result.push({ x, y });
    if (d > 0) {
      x += xi;
      d -= 2 * dy;
    }
    d += 2 * dx;
  }
  return result;
}

export default function bresenham(start, end) {
  if (Math.abs(end.y - start.y) < Math.abs(end.x - start.x)) {
    if (start.x > end.x) {
      return plotLineLow(end, start);
    } else {
      return plotLineLow(start, end);
    }
  } else {
    if (start.y > end.y) {
      return plotLineHigh(end, start);
    } else {
      return plotLineHigh(start, end);
    }
  }
}
