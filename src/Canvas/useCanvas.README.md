# useCanvas

So as the project progresses, we will want to access the state of the canvas in more and more places. In order to facilitate this, we will use react's context api to pass the state of the canvas down deeply in the tree.

How it works is unimportant (tbh), what's important is how you use it.

## How to use it

```js
import useCanvas from "../path/to/useCanvas";

function SomeComponent() {
  let canvas = useCanvas();
  // rest of the render code
}
```

NOTE: `useCanvas` is a react hook, which means the following:

1. It cannot be used in a class component (`class extends Component`)
2. It cannot be conditionally called:

```js
// DO NOT DO THIS
function BadComponent() {
  if (invalidThingToDo) {
    let canvas = useCanvas();
  }
}
```

Notably, it _must_ be used in the "top-level" of the component, like I show in the "good" example above.

## Available API's:

### `selection`

Gets the current selection of the canvas.

### `draw`

Draw on the canvas at the specified position:

```js
canvas.draw({ x: 0, y: 0 });
```

You can optionally provide a color to draw with. It will not effect the color of the canvas outside of this draw call.

```js
canvas.draw({ x: 0, y: 0 }, "red");
```

### `interact`

- Danger Zone \*

This is a low-level api. Let me break down what it does and why.

So basically, we have two canvases. One of them is the "canonical" canvas, and it's hidden. When the user downloads the canvas, we download this one. The one we show is the real one. Most of the time, you want to draw on both of the canvases. `interact` facilitates that interaction:

```js
canvas.interact(canvas => {
  let ctx = canvas.getContext("2d");
  ctx.fillRect(/* etc */);
});
```

The function you provide will be called with both canvases. There will be no indication of which: if your code needs to handle this case, you might want to extend this `useCanvas` function instead.

## `_lowLevel`

Should only be used by the `Canvas` component.
