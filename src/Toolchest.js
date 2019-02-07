import React from "react";
import styled from "@emotion/styled";

const SidebarWrapper = styled.div`
  /* This color is only to help indicate the boundaries of this component on the page. Feel free to remove */
  background-color: green;

  height: 100%;
`;

export default function Toolchest(props) {
  return <SidebarWrapper>Tools, etc, etc</SidebarWrapper>;
}
