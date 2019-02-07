import React from "react";
import styled from "@emotion/styled";

const NavBarWrapper = styled.div`
  /* This color is only to help indicate the boundaries of this component on the page. Feel free to remove */
  background-color: blue;
`;

export default function Toolbar(props) {
  return <NavBarWrapper>File, Edit, View, Etc..</NavBarWrapper>;
}
