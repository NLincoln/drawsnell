import React from "react";
import styled from "@emotion/styled";
import ColorPicker from "./tools/colorPicker";
// import bmodesDict from "./blendModes";
import bmodes from "./layers/blendModes";

const PanelWrapper = styled.div`
  /* This color is only to help indicate the boundaries of this component on the page. Feel free to remove */
  background-color: turquoise;

  height: 100%;
`;

export default function RightPanel(props) {

  ///////////////////////////////
  // general purpose functions //
  ///////////////////////////////

  // used by the array sort method
  function numericalSort(a, b) {
    return a > b ? 1 : b > a ? -1 : 0;
  }

  // swaps any two layers by index, both at composition and GUI level
  function swapCompLayers(layNum1, layNum2) {
    // swaps layers at the composition level
    let tempComp = props.mainComp.layers[layNum1];
    props.mainComp.layers[layNum1] = props.mainComp.layers[layNum2];
    props.mainComp.layers[layNum2] = tempComp;

    // also swap selected layers
    let ars = [props.activeLayers] // array of arrays
    for (let ii = 0; ii < ars.length; ii++) {
      let temp = Array.from(ars[ii])
      let removal = undefined;
      let putin = undefined;
      if (ars[ii].includes(layNum1) && !ars[ii].includes(layNum2)) {
        removal = layNum1;
        putin = layNum2;
      }
      else if (!ars[ii].includes(layNum1) && ars[ii].includes(layNum2)) {
        removal = layNum2;
        putin = layNum1;
      }
      temp = temp.filter(arrayItem => arrayItem !== removal);
      if (putin !== undefined) {
        temp.push(putin)
      }
      temp.sort(numericalSort)

      switch (ii) {
        case 0:
          props.changeActiveLayers(temp); break;
        // case 1:
        //   props.changeSoloLayers(temp); break;
        default:
          break;
      }
    }

    // update any other layer-specific gui related info
    props.changeGUI(!props.GUI); // update GUI
  }

  // testing functions to see the opacity of layers
  function opacityUp() {
    for (let ii = 0; ii < props.activeLayers.length; ii++) {
      let ind = props.activeLayers[ii];
      if (props.mainComp.layers[ind].opacity < 0.9) {
        props.mainComp.layers[ind].opacity += 0.1;
      }
      else {
        props.mainComp.layers[ind].opacity = 1.0
      }
    }
    props.changeOneTimeEvent("redrawCanvas");
  }
  function opacityDown() {
    for (let ii = 0; ii < props.activeLayers.length; ii++) {
      let ind = props.activeLayers[ii];
      if (props.mainComp.layers[ind].opacity > 0.1) {
        props.mainComp.layers[ind].opacity -= 0.1;
      }
      else {
        props.mainComp.layers[ind].opacity = 0.0
      }
    }
    props.changeOneTimeEvent("redrawCanvas");
  }
  function clearLayers() {
    props.changeOneTimeEvent("clearActiveLayers");
  }

  function addLayer() {

    // the default layer name depends on the current number of layers
    let currentNumLayers = props.mainComp.layers.length
    props.mainComp.addLayer("Layer " + currentNumLayers.toString());
    props.changeActiveLayers(Array.from(props.activeLayers)) // doesn't update GUI without this line and I'm not sure why
  }

  function deleteSelectedLayers() {
    let newLayers = []

    // check to make sure the user isn't deleting EVERY layer; that would be bad
    // we subtract one here because the bottom layer isn't accessible to the user
    if (props.activeLayers.length === props.mainComp.layers.length - 1) {
      window.alert("You can't delete EVERY layer! Please deslect at least one layer before continuing.");
    }
    else {
      for (let i = 0; i < props.mainComp.layers.length; i++) {
        if (!props.activeLayers.includes(i)) {
          newLayers.push(props.mainComp.layers[i]);
        }
      }
      props.mainComp.layers = newLayers;

      props.changeActiveLayers([]); // updates the GUI, makes no layers selected

      // suppose the last solo layers was just deleted
      // then the other layers need to become visible,
      // so we must recalculate solo layer visibility
      props.mainComp.calculateSoloLayerVisibility();
      props.changeOneTimeEvent("redrawCanvas");
    }
  }

  // individual layer functions
  function toggleLayerSelect(layNum) {
    let temp = Array.from(props.activeLayers) // create a deep copy of active layers
    if (temp.includes(layNum)) // deselect the layer
    {
      temp = temp.filter(arrayItem => arrayItem !== layNum);
    }
    else {
      temp.push(layNum)
    }
    temp.sort(numericalSort) // sorts like strings otherwise
    props.changeActiveLayers(temp)
  }

  function makeLayerSolo(layNum) {
    props.mainComp.layers[layNum].isSolo = !props.mainComp.layers[layNum].isSolo; // invert whether solo or not
    props.mainComp.calculateSoloLayerVisibility(); // calculate which layers are visible based on solos
    // props.changeGUI(null); // update GUI
    props.changeGUI(!props.GUI); // update GUI
    props.changeOneTimeEvent("redrawCanvas")
  }

  function moveLayerDownOne(layNum) {
    if (layNum !== 1) {
      swapCompLayers(layNum, layNum - 1)
      props.changeOneTimeEvent("redrawCanvas")
    }
    else {
      window.alert("You can't move that layer down any lower!")
    }
  }

  function moveLayerUpOne(layNum) {
    if (layNum !== props.mainComp.layers.length - 1) {
      swapCompLayers(layNum, layNum + 1)
      props.changeOneTimeEvent("redrawCanvas")
    }
    else {
      window.alert("You can't move that layer up any higher!")
    }
  }
  /*
  function changeBlendMode(layNum, selectID)
  {
    let blendModeStr = document.getElementById(selectID).value
    let blendMode = bmodes.normal
    switch(blendModeStr)
    {
      case "Add":
      blendMode = bmodes.add
      break;
      case "Overlay":
      blendMode = bmodes.overlay
      break;
    }
    props.mainComp.layers[layNum].blendMode = blendMode;
    props.mainComp.layers[layNum].blendModeStr = blendModeStr;
    props.changeOneTimeEvent("redrawCanvas")
    props.changeGUI(null); // update GUI
    // return blendModeStr
  }
  */
  function changeBlendModeForSelectedLayers() {
    for (let ii = 0; ii < props.activeLayers.length; ii++) {
      let ind = props.activeLayers[ii];

      let blendModeStr = document.getElementById("blendModeSelectID").value
      let blendMode = bmodes.lookup[blendModeStr]
      props.mainComp.layers[ind].blendMode = blendMode;
      props.mainComp.layers[ind].blendModeStr = blendModeStr;
    }
    props.changeOneTimeEvent("redrawCanvas");
    document.getElementById("blendModeSelectID").value = "Blend Mode"
  }

  function renameSelectedLayers() {
    let j = document.getElementById("LayerNameTextField").value;
    for (let ii = 0; ii < props.activeLayers.length; ii++) {
      let ind = props.activeLayers[ii];
      props.mainComp.layers[ind].name = j;
    }

    // let jj = 5;
    // if (props.GUI == null) {jj = 5} else {jj = null}
    props.changeGUI(!props.GUI); // update GUI
  }
  
  function swapColors()
  {
    let tempcolor = props.color;
    let tempcolor2 = props.color2;
    props.onColorChange(tempcolor2);
    props.onColor2Change(tempcolor);
  }
  
  function clearSelection()
  {
    // window.alert("cleared selection");
    props.changeOneTimeEvent("clearSelection");
  }
  
  function deleteSelectedPixels()
  {
    // window.alert("cleared selected pixels");
    let j = props.selection
    
    for (let ii = 0; ii < props.activeLayers.length; ii++) 
    {
      let ind = props.activeLayers[ii];
      
      let whichPixels = null
      if(props.selection.magicWandSelectedPixels != null)
      {
        whichPixels = props.selection.magicWandSelectedPixels
      }
      else // if(props.selection.magicWandSelectedPixels != null) // strict else may be safer
      {
        whichPixels = props.selection.rectangleSelectedPixels
      }
      for(let pixind = 0; pixind < whichPixels.length; pixind++)
      {
        let xx = whichPixels[pixind].x
        let yy = whichPixels[pixind].y
        props.mainComp.layers[ind].pixelData[xx][yy].r = 255;
        props.mainComp.layers[ind].pixelData[xx][yy].g = 255;
        props.mainComp.layers[ind].pixelData[xx][yy].b = 255;
        props.mainComp.layers[ind].pixelData[xx][yy].a = 0;
      }
    }
    props.changeOneTimeEvent("redrawCanvas");
    
    // window.alert(j)
  }


  ///////////////////////////////
  // dynamic layer GUI manager //
  ///////////////////////////////
  function LayerItem(param) // param corresponds to the index of the layer in question
  {

    let selectedString = "Select"
    if (props.activeLayers.includes(param.value)) {
      selectedString = "Deselect"
    }
    let soloString = "Solo"
    if (props.mainComp.getSolos().includes(param.value)) {
      soloString = "Unsolo"
    }

    // let bmodeSelectID = "a" + param.value.toString()

    return <>

      {/* Layer {param.value}&nbsp;&nbsp; */}
      {props.mainComp.layers[param.value].name} &nbsp;&nbsp;
    <button onClick={(e) => moveLayerUpOne(param.value)}>
        &#9650;
    </button>

      <button onClick={(e) => moveLayerDownOne(param.value)}>
        &#9660;
    </button>

      {/* doesn't work and I'm not sure why */}
      {/* <select id={bmodeSelectID} onChange={(e) => changeBlendMode(param.value, bmodeSelectID)} >
      <option value="Blend Mode">Blend Mode</option>
      <option value="Normal">Normal</option>
      <option value="Add">Add</option>
      <option value="Overlay">Overlay</option>
    </select> */}

      <button onClick={(e) => makeLayerSolo(param.value)}>
        {soloString}
      </button>

      <button onClick={(e) => toggleLayerSelect(param.value)}>
        {selectedString}
      </button>

      &nbsp;&nbsp;{props.mainComp.layers[param.value].blendModeStr}

      <br />
    </>;
  }

  function LayerList(props) {
    // const numbers = props.activeLayers;

    let numbers = [];
    for (let i = 1; i < props.mainComp.layers.length; i++) // layer at index 0 is NOT a true layer the user can manage
    {
      numbers.push(i);
    }
    numbers.reverse(); // reverse the array here so higher layers are on top of lower layers, like Photoshop's layer panel

    return (
      <ul>
        {numbers.map((number) =>
          <LayerItem key={number.toString()} value={number} />
        )}
      </ul>
    );
  }

  return <PanelWrapper>Layers, color picker, etc
    <br />
    Color 1<ColorPicker color={props.color} onColorChange={props.onColorChange} />
    Color 2<ColorPicker color={props.color2} onColorChange={props.onColor2Change} />

    <button onClick={(e) => swapColors()}>
      Swap Colors
    </button>
    
    <br />
    
    <button onClick={() => clearSelection()}>Clear Selection</button>
  
    <br />

    These buttons apply to all currently selected (active) layers

    <br />

    {/* Opacity: &nbsp;&nbsp;&nbsp; */}
    {/* Opacity: &emsp; */}
    <button onClick={(e) => opacityUp()}>
      +
    </button>

    <button onClick={(e) => opacityDown()}>
      -
    </button>
    &nbsp;(Opacity)
    <br />

    <button onClick={(e) => clearLayers()}>
      Clear
    </button>
    
    <button onClick={(e) => deleteSelectedPixels()}>
      Clear Selected Pixels
    </button>

    <br />

    <button onClick={(e) => deleteSelectedLayers()}>
      Delete
    </button>

    <br />
    <select id="blendModeSelectID" onChange={(e) => changeBlendModeForSelectedLayers()}>
      <option value="Blend Mode">Blend Mode</option>
      <option value="Normal">Normal</option>
      <option value="Darken">Darken</option>
      <option value="Multiply">Multiply</option>
      <option value="Color Burn">Color Burn</option>
      <option value="Linear Burn">Linear Burn</option>
      <option value="Lighten">Lighten</option>
      <option value="Screen">Screen</option>
      <option value="Color Dodge">Color Dodge</option>
      <option value="Add">Add</option>
      <option value="Overlay">Overlay</option>
      <option value="Soft Light">Soft Light</option>
      <option value="Hard Light">Hard Light</option>
      <option value="Vivid Light">Vivid Light</option>
      <option value="Linear Light">Linear Light</option>
      <option value="Pin Light">Pin Light</option>
      <option value="Hard Mix">Hard Mix</option>
      <option value="Difference">Difference</option>
      <option value="Exclusion">Exclusion</option>
      <option value="Subtract">Subtract</option>
      <option value="Divide">Divide</option>
      <option value="Grain Extract">Grain Extract</option>
      <option value="Grain Merge">Grain Merge</option>
    </select>

    <br />

    <input id="LayerNameTextField" type="text" name="LayerName" placeholder="Enter a new layer name"></input>
    <button onClick={(e) => renameSelectedLayers()}>
      Rename Selected Layers
    </button>

    <br />

    Layer Manager

    <br />

    {/* Active Layers = {props.activeLayers.join(", ")} */}
    Active Layers = {props.mainComp.getLayerNamesStringFromArrayOfIndices(props.activeLayers)}
    <br />
    {/* Solo Layers = {props.mainComp.getSolos().join(", ")} */}
    Solo Layers = {props.mainComp.getLayerNamesStringFromArrayOfIndices(props.mainComp.getSolos())}

    <br />

    <button onClick={(e) => addLayer()}>
      Add New Layer
    </button>

    <LayerList mainComp={props.mainComp} activeLayers={props.activeLayers} />

  </PanelWrapper>;
}
