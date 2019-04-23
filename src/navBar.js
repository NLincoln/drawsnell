import React from "react";
import Export from "./saving/export";
import Save from "./saving/save";
import ImportImage from './opening/image';
import ImportFunction from './opening/json';
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
    <ImportImage
      mainComp={props.mainComp}
      activeLayers={props.activeLayers}
      changeMainComp={props.changeMainComp}
      changeActiveLayers={props.changeActiveLayers}
      oneTimeEvent={props.oneTimeEvent}
      changeOneTimeEvent={props.changeOneTimeEvent}
    />
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
