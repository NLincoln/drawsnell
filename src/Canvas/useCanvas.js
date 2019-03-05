import { useRef, useState, createContext } from "react";
const Context = createContext(null);

export default function useCanvas() {
  let realCanvasRef = useRef(null);
  let fakeCanvasRef = useRef(null);
  let [selection, setSelection] = useState(null);

  return {
    lowLevel: {
      refs: {
        real: realCanvasRef,
        fake: realCanvasRef
      },
      setSelection
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
    },

    /**
     * Returns the current selection,
     * or none if there isn't anything selected.
     */
    selection() {
      return selection;
    }
  };
}
