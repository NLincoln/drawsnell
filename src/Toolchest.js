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
      Tools, etc, etc
      <button onClick={() => toggleTool(TOOLS.erase)}>Eraser</button>
      <button onClick={() => toggleTool(TOOLS.select)}>Select</button>
    </SidebarWrapper>
  );
}
