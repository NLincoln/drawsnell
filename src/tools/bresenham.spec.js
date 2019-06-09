import bresenham from "./bresenham";

test("vertical line", () => {
  expect(
    bresenham(
      {
        x: 1,
        y: 1,
      },
      {
        x: 1,
        y: -3,
      },
    ),
  ).toEqual([
    { x: 1, y: -3 },
    { x: 1, y: -2 },
    { x: 1, y: -1 },
    { x: 1, y: 0 },
    { x: 1, y: 1 },
  ]);
});

test("not actually moving", () => {
  expect(bresenham({ x: 1, y: 1 }, { x: 1, y: 1 })).toEqual([
    {
      x: 1,
      y: 1,
    },
  ]);
});

test("moving one square horizontally", () => {
  expect(bresenham({ x: 1, y: 1 }, { x: 0, y: 1 })).toEqual([
    {
      x: 0,
      y: 1,
    },
    {
      x: 1,
      y: 1,
    },
  ]);
});

test("moving... multiple squares horizontally", () => {
  expect(bresenham({ x: 4, y: 1 }, { x: 1, y: 1 })).toEqual([
    {
      x: 1,
      y: 1,
    },
    {
      x: 2,
      y: 1,
    },
    {
      x: 3,
      y: 1,
    },
    {
      x: 4,
      y: 1,
    },
  ]);
});
