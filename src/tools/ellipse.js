import bresenham from "./bresenham";

export default function ellipse(start, end) {
  let step = Math.PI / 10;

  let x = Math.abs(start.x + end.x) / 2;
  let y = Math.abs(start.y + end.y) / 2;

  let xr = Math.abs(start.x - end.x) / 2;
  let yr = Math.abs(start.y - end.y) / 2;

  let ellipsePoints = [];
  let theta = 0;

  let prevx = Math.round(x + xr * Math.cos(theta));
  let prevy = Math.round(y + yr * Math.sin(theta));

  for (; theta <= 2 * Math.PI; theta += step) {
    let newx = Math.round(x + xr * Math.cos(theta));
    let newy = Math.round(y + yr * Math.sin(theta));
    ellipsePoints = ellipsePoints.concat(
      bresenham({ x: prevx, y: prevy }, { x: newx, y: newy }),
    );
    prevx = newx;
    prevy = newy;
  }

  return ellipsePoints;
}
