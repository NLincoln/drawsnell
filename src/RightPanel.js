import React from "react";
import styled from "@emotion/styled";
import ColorPicker from "./ColorPicker";

const PanelWrapper = styled.div`
  /* This color is only to help indicate the boundaries of this component on the page. Feel free to remove */
  background-color: turquoise;

  height: 100%;
`;

export default function RightPanel(props) {
  return <PanelWrapper>Layers, color picker, etc
    <ColorPicker color={props.color} onColorChange={props.onColorChange} />
  </PanelWrapper>;
}
