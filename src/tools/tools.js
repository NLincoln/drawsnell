import { useState, useEffect, useCallback } from "../../node_modules/react";

// Object.freeze means this object can't be modified later
export const TOOLS = Object.freeze({
  draw: 'draw',
  erase: 'erase',
  fill: 'fill',
  select: 'select',
  brush: 'brush',
  questionTool: 'questionTool',
  line: 'line',
  continuousLine: 'continuousLine',
  calligBrush: 'calligBrush',
  sprinkle: 'sprinkle',
  rectangle: 'rectangle',
  ellipse: 'ellipse',
});

export const TOOL_CURSORS = Object.freeze({
  erase: "alias", // Placeholder
  fill: "crosshair", // Placeholder
  select: "cell", // Placeholder
});

// only locally available: all interactions should
// go through toolShortcutHandler
const TOOL_KEYS = {
  d: TOOLS.draw,
  e: TOOLS.erase,
  f: TOOLS.fill,
  l: TOOLS.select
};

/**
 * @param {keyof TOOLS} currentTool
 * @param {KeyboardEvent} event
 * @returns {keyof TOOLS}
 */
export function toolShortcutHandler(currentTool, event) {
  if (!event.ctrlKey) {
    return currentTool;
  }
  if (TOOL_KEYS[event.key]) {
    event.preventDefault();
    return TOOL_KEYS[event.key];
  }
  return currentTool;
}

export function useToolHandler() {
  let [tool, setTool] = useState(TOOLS.draw);

  const onToolChange = useCallback(
    nextTool => {
      // Used to change the cursor style whenever currentTool gets updated
      let root = document.getElementById("root");

      if (tool === TOOLS.erase) {
        // Make it a pictue located at url
        // root.style.cursor = "url('')"
        root.style.cursor = "alias"; // Placeholder
      } else if (tool === TOOLS.fill) root.style.cursor = "crosshair";
      // Placeholder
      else if (tool === TOOLS.select) root.style.cursor = "cell";
      // Placeholder
      else root.style.cursor = "default"; // Placeholder

      setTool(nextTool);
    },
    [setTool]
  );

  useEffect(() => {
    const onKeyDown = event => {
      onToolChange(toolShortcutHandler(tool, event));
    };
    document.body.addEventListener("keydown", onKeyDown);
    return () => document.body.removeEventListener("keydown", onKeyDown);
  }, [tool, onToolChange]);

  return [tool, onToolChange];
}
