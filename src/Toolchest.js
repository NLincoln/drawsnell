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

  return (
    <SidebarWrapper>
      <ul>
        <li><button onClick={() => toggleTool(TOOLS.draw)}>(D)raw</button></li>
        <li><button onClick={() => toggleTool(TOOLS.erase)}>(E)raser</button></li>
        <li><button onClick={() => toggleTool(TOOLS.select)}>Se(l)ect</button></li>
        <li><button onClick={() => toggleTool(TOOLS.fill)}>(F)ill</button></li>
        <li><button onClick={() => toggleTool(TOOLS.line)}>Line</button></li>
        <li><button onClick={() => toggleTool(TOOLS.continuousLine)}>Continuous Line</button></li>
        <li><button onClick={() => toggleTool(TOOLS.brush)}>Brush</button></li>
        <li><button onClick={() => toggleTool(TOOLS.calligBrush)}>Calligraphy Brush</button></li>
        <li><button onClick={() => toggleTool(TOOLS.sprinkle)}>Sprinkle</button></li>
        <li><button onClick={() => toggleTool(TOOLS.questionTool)}>?</button></li>
        <li><button onClick={() => toggleTool(TOOLS.eyedropper)}>Eyedropper</button></li>
      </ul>
      <div class="radiusSlider">
        <p>
          Radius:
          <input
            type="number"
            min="1"
            max="100"
            value={props.radius}
            onChange={event => {
              props.setRadius(Number(event.target.value));
            }}
          />
        </p>
      </div>
    </SidebarWrapper>
  );
}
