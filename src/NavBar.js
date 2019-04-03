import React from "react";
import Export from "./Export"
import Save from "./Save"
import ImportImage from './ImportImage'
import ImportFunction from './ImportJSON'
import styled from "@emotion/styled";

const NavBarWrapper = styled.div`
  /* This color is only to help indicate the boundaries of this component on the page. Feel free to remove */
  background-color: blue;
`;

export default function Toolbar(props) {
  return <NavBarWrapper>
    <Export />
    <Save
      mainComp={props.mainComp}
      activeLayers={props.activeLayers}
    />
    <ImportImage />
    <ImportFunction
      mainComp={props.mainComp}
      activeLayers={props.activeLayers}
      changeMainComp={props.changeMainComp}
      changeActiveLayers={props.changeActiveLayers}
      oneTimeEvent={props.oneTimeEvent}
      changeOneTimeEvent={props.changeOneTimeEvent}
    />
  </NavBarWrapper>;
}
