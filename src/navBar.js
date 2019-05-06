import React from "react";
import Export from "./saving/export";
import Save from "./saving/save";
import ImportImage from "./opening/image";
import ImportFunction from "./opening/json";
import styled from "@emotion/styled";
import DarkModeToggle from "./darkMode/darkModeToggle";

const Grid = styled.div`
  display: grid;
  grid-template-areas:
    "importImage importFunc"
    "save export"
    "toggle toggle";
`;

const GridArea = styled.div`
  grid-area: ${props => props["area"]};
`;

export default function Toolbar(props) {
  return (
    <Grid className="navBar">
      <GridArea area={"toggle"} className="darkLightToggleButton">
        <DarkModeToggle />
      </GridArea>
      <GridArea agea={"export"}>
        <Export />
      </GridArea>
      <GridArea area={"save"}>
        <Save mainComp={props.mainComp} activeLayers={props.activeLayers} />
      </GridArea>
      <GridArea area={"importImage"}>
        <ImportImage
          mainComp={props.mainComp}
          activeLayers={props.activeLayers}
          changeMainComp={props.changeMainComp}
          changeActiveLayers={props.changeActiveLayers}
          oneTimeEvent={props.oneTimeEvent}
          changeOneTimeEvent={props.changeOneTimeEvent}
        />
      </GridArea>
      <GridArea area={"importFunc"}>
        <ImportFunction
          mainComp={props.mainComp}
          activeLayers={props.activeLayers}
          changeMainComp={props.changeMainComp}
          changeActiveLayers={props.changeActiveLayers}
          oneTimeEvent={props.oneTimeEvent}
          changeOneTimeEvent={props.changeOneTimeEvent}
        />
      </GridArea>
    </Grid>
  );
}
