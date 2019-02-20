import React from "react";
import styled from "@emotion/styled";
import ColorPicker from "./ColorPicker";
// import {TOOLS} from './tools';

const PanelWrapper = styled.div`
  /* This color is only to help indicate the boundaries of this component on the page. Feel free to remove */
  background-color: turquoise;

  height: 100%;
`;

export default function RightPanel(props) {
  return <PanelWrapper>Layers, color picker, etc
    <ColorPicker color={props.color} onColorChange={props.onColorChange} />
    <button onClick={(e) => props.randomizeColors()}>
      Randomize Canvas Colors
    </button>
    <br />
    <button onClick={(e) => props.clearCanvas()}>
      Clear Canvas
    </button>
  </PanelWrapper>;
}
