import React from "react";
import styled from "@emotion/styled";
import {
  TOOLS
} from './tools';

const SidebarWrapper = styled.div `
  /* This color is only to help indicate the boundaries of this component on the page. Feel free to remove */
  background-color: green;

  height: 100%;
`;

export default function Toolchest(props) {

  function toggleErase() {
    if (props.currentTool === TOOLS.erase) // If tool is erase
    {
      props.onToolChange(TOOLS.draw); // Set to draw
    } else {
      props.onToolChange(TOOLS.erase); // Set to erase
    }
  }

  function updateRadius() {
    const value = parseInt(document.getElementById("radius").value);
    props.setRadius(value);
  }

  return <SidebarWrapper > Tools, etc, etc <
    button onClick = {
      (e) => toggleErase()
    } >
    Eraser <
    /button> <
  div class = "radiusSlider" >
    <
    p > Radius: < /p> <
  input type = "number"
  id = "radius"
  min = "1"
  max = "100"
  defaultValue = "1" / >
    <
    button onClick = {
      updateRadius
    } >
    Submit <
    /button> < /
    div > <
    /SidebarWrapper>;
}