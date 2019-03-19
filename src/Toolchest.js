import React from "react";
import styled from "@emotion/styled";
import { TOOLS } from "./tools";

const SidebarWrapper = styled.div`
  /* This color is only to help indicate the boundaries of this component on the page. Feel free to remove */
  background-color: green;

  height: 100%;
`;

export default function Toolchest(props) {
  const toggleTool = tool => {
    if (props.currentTool === tool) {
      // tool is already our current one, toggle it off
      props.onToolChange(TOOLS.draw);
    } else {
      props.onToolChange(tool);
    }
  };

  function updateRadius() {
    const value = parseInt(document.getElementById("radius").value);
    props.setRadius(value);
  }

  return (
    <SidebarWrapper>
      Tools, etc, etc
      <button onClick={() => toggleTool(TOOLS.draw)}>Draw</button>
      <button onClick={() => toggleTool(TOOLS.erase)}>Eraser</button>
      <button onClick={() => toggleTool(TOOLS.select)}>Select</button>
      <button onClick={() => toggleTool(TOOLS.fill)}>Fill</button>
      <button onClick={() => toggleTool(TOOLS.line)}>Line</button>
      <button onClick={() => toggleTool(TOOLS.continuousLine)}>Continuous Line</button>
      <div class="radiusSlider">
        <p>Radius: </p>
        <input type="number" id="radius" min="1" max="100" defaultValue="1" />
        <button onClick={updateRadius}>
          Submit
      </button>
      </div>
    </SidebarWrapper>
  );
}
