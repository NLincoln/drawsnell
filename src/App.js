import React from "react";
import Canvas from "./Canvas";
import NavBar from "./NavBar";
import ToolChest from "./Toolchest";
import RightPanel from "./RightPanel";
import ColorPicker from "./ColorPicker";

/* */

import styled from "@emotion/styled";

const Grid = styled.div`
  display: grid;
  grid-gap: 16px;
  grid-template-areas:
    "navbar navbar navbar navbar navbar"
    "toolchest canvas canvas canvas right-panel";
`;

const GridArea = styled.div`
  grid-area: ${props => props["area"]};
`;

// const drawcolor = React.createContext('rgb(0, 50, 100, 255)');

export default function App() {
  
  // console.log(drawcolor)
  var drawcolor = 'rgb(0, 50, 100, 255)'
  // ColorPicker.setState({displayColorPicker: true});
  
  return (
    <Grid>
      <GridArea area={"navbar"}>
        <NavBar />
      </GridArea>
      <GridArea area={"canvas"}>
        <Canvas drawcolor={drawcolor} />
        {/* <Canvas /> */}
      </GridArea>
      <GridArea area={"toolchest"}>
        <ToolChest />
      </GridArea>
      <GridArea area={"right-panel"}>
        <RightPanel />
      </GridArea>
      
      <GridArea area={"colorpicker"}>
        <ColorPicker />
      </GridArea>
      
    </Grid>
  );
}
