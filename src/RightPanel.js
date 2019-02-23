import React from "react";
import styled from "@emotion/styled";
import ColorPicker from "./ColorPicker";

const PanelWrapper = styled.div`
  /* This color is only to help indicate the boundaries of this component on the page. Feel free to remove */
  background-color: turquoise;

  height: 100%;
`;

export default function RightPanel(props) 
{
  
  // testing functions to see the opacity of layers
  function opacityUp()
  {
    for(let ii = 0; ii < props.activeLayers.length; ii++)
    {
      let ind = props.activeLayers[ii];
      if(props.mainComp.layers[ind].opacity < 0.9)
      {
        props.mainComp.layers[ind].opacity += 0.1;
      }
      else
      {
        props.mainComp.layers[ind].opacity = 1.0
      }
    }
    props.changeOneTimeEvent("redrawCanvas");
  }
  function opacityDown()
  {
    for(let ii = 0; ii < props.activeLayers.length; ii++)
    {
      let ind = props.activeLayers[ii];
      if(props.mainComp.layers[ind].opacity > 0.1)
      {
        props.mainComp.layers[ind].opacity -= 0.1;
      }
      else
      {
        props.mainComp.layers[ind].opacity = 0.0
      }
    }
    props.changeOneTimeEvent("redrawCanvas");
  }
  function swapActiveLayer()
  {
    if(props.activeLayers[0] == 1)
    {
      props.changeActiveLayers([2])
    }
    else
    {
      props.changeActiveLayers([1])
    }
  }
  function switchLayersZOrder()
  {
    let temp = props.mainComp.layers[1];
    props.mainComp.layers[1] = props.mainComp.layers[2];
    props.mainComp.layers[2] = temp;
    props.changeOneTimeEvent("redrawCanvas");
  }
  
  
  return <PanelWrapper>Layers, color picker, etc
    <ColorPicker color={props.color} onColorChange={props.onColorChange} />
    
    
    <button onClick={(e) => swapActiveLayer()}>
      Swap Active Layers
    </button>
    
    Active Layers = {props.activeLayers}
    
    <br />
    
    <button onClick={(e) => switchLayersZOrder()}>
      Switch Layer Z Order
    </button>
    
    <br />
    
    <button onClick={(e) => opacityUp()}>
      Opacity Up for layers {props.activeLayers}
    </button>
    <br />
    <button onClick={(e) => opacityDown()}>
    Opacity Down for layers {props.activeLayers}
    </button>
    
  </PanelWrapper>;
}
