import React from "react";
import styled from "@emotion/styled";
import Button from "@material-ui/core/Button";
import { TOOLS } from "./tools/tools";

const SidebarWrapper = styled.div`
  /* This color is only to help indicate the boundaries of this component on the page. Feel free to remove */
  background-color: green;

  height: 100%;
`;

const Grid = styled.div`
  display: grid;
  grid-template-areas:
    "drawtool eraser"
    "brush line"
    "rectangle ellipse"
    "fill eyedropper"
    "move select";
`;

const GridArea = styled.div`
  grid-area: ${props => props["area"]};
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
      <Grid>
        <GridArea area={"drawtool"}>
          <Button onClick={() => toggleTool(TOOLS.draw)}>(D)raw</Button>
        </GridArea>
        <GridArea area={"eraser"}>
          <Button onClick={() => toggleTool(TOOLS.erase)}>(E)raser</Button>
        </GridArea>
        <GridArea area={"brush"}>
          <Button onClick={() => toggleTool(TOOLS.brush)}>Brush</Button>
        </GridArea>
        <GridArea area={"line"}>
          <Button onClick={() => toggleTool(TOOLS.line)}>Line</Button>
        </GridArea>
        <GridArea area={"rectangle"}>
          <Button onClick={() => toggleTool(TOOLS.rectangle)}>Rectangle</Button>
        </GridArea>
        <GridArea area={"ellipse"}>
          <Button onClick={() => toggleTool(TOOLS.ellipse)}>Ellipse</Button>
        </GridArea>
        <GridArea area={"fill"}>
          <Button onClick={() => toggleTool(TOOLS.fill)}>(F)ill</Button>
        </GridArea>
        <GridArea area={"eyedropper"}>
          <Button>Eyedropper</Button>
        </GridArea>
        <GridArea area={"move"}>
          <Button>Move</Button>
        </GridArea>
        <GridArea area={"select"}>
          <Button onClick={() => toggleTool(TOOLS.select)}>Se(l)ect</Button>
        </GridArea>
      </Grid>
      <Button onClick={() => toggleTool(TOOLS.magicWand)}>(M)agic Wand</Button>
      &nbsp;Tolerance:
      <input
        type="number"
        min="0"
        max="255"
        value={props.tolerance}
        onChange={event => {
          props.setTolerance(Number(event.target.value));
        }}
      />
      <Button onClick={() => toggleTool(TOOLS.continuousLine)}>
        Continuous Line
      </Button>
      <Button onClick={() => toggleTool(TOOLS.calligBrush)}>
        Calligraphy Brush
      </Button>
      <Button onClick={() => toggleTool(TOOLS.sprinkle)}>Sprinkle</Button>
      <Button onClick={() => toggleTool(TOOLS.questionTool)}>?</Button>
      <div>
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
