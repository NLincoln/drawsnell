import React from "react";
import styled from "@emotion/styled";
import {TOOLS} from './tools';

const SidebarWrapper = styled.div`
  /* This color is only to help indicate the boundaries of this component on the page. Feel free to remove */
  background-color: green;

  height: 100%;
`;



export default function Toolchest(props) {

  function toggleErase()
  {
    if(props.currentTool === TOOLS.erase) // If tool is erase
    {
      props.onToolChange(TOOLS.draw); // Set to draw
    }
    else
    {
      props.onToolChange(TOOLS.erase); // Set to erase
    }
  }

  function toggleFill()
  {
    if(props.currentTool === TOOLS.fill) // If tool is fill
    {
      props.onToolChange(TOOLS.draw); // Set to draw
    }
    else
    {
      props.onToolChange(TOOLS.fill); // Set to fill
    }
  }

  function setToDraw()
  {
    if(props.currentTool !== TOOLS.draw)
      props.onToolChange(TOOLS.draw);
  }

  function toggleEyedropper()
  {
    if(props.currentTool === TOOLS.eyedropper) // If tool is eyedropper
    {
      props.onToolChange(TOOLS.draw); // Set to draw
    }
    else
    {
      props.onToolChange(TOOLS.eyedropper); // Set to eyedropper
    }
  }
  return <SidebarWrapper>Tools, etc, etc
    <button onClick={(e) => setToDraw()}>
      Draw
    </button>
    <button onClick={(e) => toggleErase()}>
      Eraser
    </button>
    <button onClick={(e) => toggleFill()}>
      Fill
    </button>
    <button onClick={(e) => toggleEyedropper()}>
      Eyedropper
    </button>
  </SidebarWrapper>;
}
