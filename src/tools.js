// Object.freeze means this object can't be modified later
export const TOOLS = Object.freeze({
    draw: 'draw',
    erase: 'erase',
    fill: 'fill',
    select: 'select'
});

export const TOOL_CURSORS = Object.freeze({
    erase: "alias", // Placeholder
    fill: "crosshair", // Placeholder
    select: "cell", // Placeholder
});