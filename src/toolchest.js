import React from "react";
import styled from "@emotion/styled";
import Button from "./Button";
import { TOOLS } from "./tools/tools";

const DoodleGrid = styled.div`
  display: grid;
  grid-gap: 24px;

  grid-template-areas:
    "drawtool eraser"
    "brush line"
    "calligBrush continuousLine"
    "fill ellipse"
    "rectangle sprinkle"
    "questionMark width";
`;

const MiscGrid = styled.div`
  display: grid;
  grid-gap: 24px;
  grid-template-areas:
    "move select"
    "magicWand magicWandConfig"
    "eyedropper eyedropper";
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
    <div>
      <DoodleGrid className="toolChest">
        <GridArea area={"drawtool"}>
          <Button variant="raised" onClick={() => toggleTool(TOOLS.draw)}>
            (D)raw
          </Button>
        </GridArea>
        <GridArea area={"eraser"}>
          <Button variant="raised" onClick={() => toggleTool(TOOLS.erase)}>
            (E)raser
          </Button>
        </GridArea>
        <GridArea area={"brush"}>
          <Button variant="raised" onClick={() => toggleTool(TOOLS.brush)}>
            Brush
          </Button>
        </GridArea>
        <GridArea area={"line"}>
          <Button variant="raised" onClick={() => toggleTool(TOOLS.line)}>
            Line
          </Button>
        </GridArea>
        <GridArea area={"calligBrush"}>
          <Button
            variant="raised"
            onClick={() => toggleTool(TOOLS.calligBrush)}
          >
            C-Brush
          </Button>
        </GridArea>
        <GridArea area={"continuousLine"}>
          <Button
            variant="raised"
            onClick={() => toggleTool(TOOLS.continuousLine)}
          >
            C-Line
          </Button>
        </GridArea>
        <GridArea area={"fill"}>
          <Button variant="raised" onClick={() => toggleTool(TOOLS.fill)}>
            (F)ill
          </Button>
        </GridArea>
        <GridArea area={"ellipse"}>
          <Button variant="raised" onClick={() => toggleTool(TOOLS.ellipse)}>
            Ellipse
          </Button>
        </GridArea>
        <GridArea area={"rectangle"}>
          <Button variant="raised" onClick={() => toggleTool(TOOLS.rectangle)}>
            Rectangle
          </Button>
        </GridArea>
        <GridArea area={"sprinkle"}>
          <Button variant="raised" onClick={() => toggleTool(TOOLS.sprinkle)}>
            Sprinkle
          </Button>
        </GridArea>
        <GridArea area={"questionMark"}>
          <Button
            variant="raised"
            onClick={() => toggleTool(TOOLS.questionTool)}
          >
            ?
          </Button>
        </GridArea>
        <GridArea area={"width"}>
          <div>
            <p>
              Width:
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
        </GridArea>
      </DoodleGrid>
      <MiscGrid className="miscChest">
        <GridArea area={"eyedropper"}>
          <Button variant="raised" onClick={() => toggleTool(TOOLS.eyedropper)}>
            Eyedropper
          </Button>
        </GridArea>
        <GridArea area={"move"}>
          <Button variant="raised">Move</Button>
        </GridArea>
        <GridArea area={"select"}>
          <Button variant="raised" onClick={() => toggleTool(TOOLS.select)}>
            Se(l)ect
          </Button>
        </GridArea>
        <GridArea area={"magicWand"}>
          <Button variant="raised" onClick={() => toggleTool(TOOLS.magicWand)}>
            (M)agic Wand
          </Button>
        </GridArea>
        <GridArea area={"magicWandConfig"}>
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
        </GridArea>
      </MiscGrid>
    </div>
  );
}
