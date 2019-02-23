import React, { useState } from "react";
import Canvas from "./Canvas";
import NavBar from "./NavBar";
import ToolChest from "./Toolchest";
import RightPanel from "./RightPanel";
import composition from "./layers";
import { TOOLS } from "./tools";

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

export default function App() {
  
  //////////////////////////
  // testing compositions //
  let aComp = new composition(40, 40, 255, 255, 255, 1.0); // used as the alpha background
  aComp.addLayer(255, 255, 255, 0); // empty layer
  aComp.layers[1].opacity = 1.0; // set to 75% opacity
  // end testing compositions //
  //////////////////////////////
  
  let [oneTimeEvent, changeOneTimeEvent] = useState("redrawCanvas"); // used for events that require a complete redraw of the canvas (such as swapping layer order)
  // let [oneTimeEvent, changeOneTimeEvent] = useState(null); // used for events that require a complete redraw of the canvas (such as swapping layer order)
  
  // changeOneTimeEvent("redrawCanvas")
  
  let [mainComp, changeMainComp] = React.useState(aComp);
  
  let [currentTool, setCurrentTool] = React.useState(TOOLS.draw);

  const onToolChange = tool => {
    // Used to change the cursor style whenever currentTool gets updated
    let root = document.getElementById("root");

    if (tool === TOOLS.erase) {
      // Make it a pictue located at url
      // root.style.cursor = "url('')"
      root.style.cursor = "wait"; // Placeholder
    } else {
      root.style.cursor = "default";
    }
    setCurrentTool(tool);
  };

  let [color, setColor] = useState({
    r: "241",
    g: "112",
    b: "19",
    a: "1"
  });

  return (
    <Grid>
      <GridArea area={"navbar"}>
        <NavBar />
      </GridArea>
      <GridArea area={"canvas"}>
        {/* <Canvas drawColor={color} currentTool={currentTool} mainComp={mainComp}/> */}
        <Canvas drawColor={color} currentTool={currentTool} mainComp={mainComp} oneTimeEvent={oneTimeEvent} changeOneTimeEvent={changeOneTimeEvent}/>
      </GridArea>
      <GridArea area={"toolchest"}>
        <ToolChest currentTool={currentTool} onToolChange={onToolChange} />
      </GridArea>
      <GridArea area={"right-panel"}>
        <RightPanel color={color} onColorChange={setColor}/>
      </GridArea>

      {/* <GridArea area={"colorpicker"}>
        <ColorPicker color={color} onColorChange={setColor} />
      </GridArea> */}
    </Grid>
  );
}
