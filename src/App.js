import React, {
  useState
} from "react";
import Canvas from "./Canvas";
import NavBar from "./NavBar";
import ToolChest from "./Toolchest";
import RightPanel from "./RightPanel";
import Composition from "./layers";
import {
  TOOLS,
  TOOL_CURSORS
} from "./tools";

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

function initComposition() {
  let aComp = new Composition(40, 40, 255, 255, 255, 1); // used as the alpha background
  aComp.addLayer(255, 255, 255, 0); // empty layer 1
  // aComp.addLayer(255, 255, 255, 0); // empty layer 2
  // aComp.layers[1].opacity = 1.0; // set to 100% opacity

  return aComp;
}

export default function App() {

  // a state with a list containing all of the users currently selected layers
  let [activeLayers, changeActiveLayers] = useState([1]);
  // just used to update the GUI when doing things such as adding a new layer
  let [GUI, changeGUI] = useState(null);

  // a value telling the canvas to do something (like redraw itself) exactly once
  let [oneTimeEvent, changeOneTimeEvent] = useState(null);
  // the data structure holding all of the pixel and layer data
  let [mainComp, changeMainComp] = React.useState(initComposition);
  // the currently selected tool
  let [currentTool, setCurrentTool] = React.useState(TOOLS.draw);

  const onToolChange = tool => {
    // Used to change the cursor style whenever currentTool gets updated
    let root = document.getElementById("root");

    let cursor = TOOL_CURSORS[tool] || "default";

    root.style.cursor = cursor;

    setCurrentTool(tool);
  };

  let [color, setColor] = useState({
    r: "241",
    g: "112",
    b: "19",
    a: "1"
  });

  let [radius, setRadius] = useState(1);

  return (
    <Grid>
      <GridArea area={"navbar"}>
        <NavBar
          mainComp={mainComp}
          activeLayers={activeLayers}
          changeMainComp={changeMainComp}
          changeActiveLayers={changeActiveLayers}
        />
      </GridArea>
      <GridArea area={"canvas"}>
        <Canvas
          drawColor={color}
          currentTool={currentTool}
          mainComp={mainComp}
          oneTimeEvent={oneTimeEvent}
          changeOneTimeEvent={changeOneTimeEvent}
          activeLayers={activeLayers}
          changeActiveLayers={changeActiveLayers}
          radius={radius}
        />
      </GridArea>
      <GridArea area={"toolchest"}>
        <ToolChest currentTool={currentTool} onToolChange={onToolChange} setRadius={setRadius} />
      </GridArea>
      <GridArea area={"right-panel"}>
        <RightPanel
          color={color}
          onColorChange={setColor}
          mainComp={mainComp}
          changeMainComp={changeMainComp}
          oneTimeEvent={oneTimeEvent}
          changeOneTimeEvent={changeOneTimeEvent}
          activeLayers={activeLayers}
          changeActiveLayers={changeActiveLayers}
          GUI={GUI}
          changeGUI={changeGUI}
        />
      </GridArea>
    </Grid>
  );
}