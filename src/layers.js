import React from "react";

class pixel
{
  constructor(r = 255, g = 255, b = 255, a = 1.0)
  {
    this.r = r;
    this.g = g;
    this.b = b;
    this.a = a;
  }
}

class layer 
{
  constructor(width = 40, height = 40, r = 255, g = 255, b = 255, a = 1.0) 
  {
    // used for internal calculations
    this.width = width;
    this.height = height;
    this.shouldDisplay = true;
    this.pixelData = [];
    
    // used by GUI primarily
    this.isSolo = false;
    
    for(var x = 0; x < this.width; x++) 
    {
      this.pixelData.push(new Array(this.height));
      for(var y = 0; y < this.height; y++)
      {
        this.pixelData[x][y] = new pixel(r, g, b, a);
      }
    }
    this.opacity = 1.0;
  }
}

class composition //extends React.Component
{
  constructor(width = 40, height = 40, r = 255, g = 255, b = 255, a = 1)
  {
    this.width = width;
    this.height = height;
    let baselayer = new layer(this.width, this.height, r = r, g = g, b = b, a = a);
    this.layers = [baselayer];
  }
  
  // updates the pixel at a given x y coord for the given layers to a new value
  updatePixelOnLayers(x, y, layerIndicesArray, new_r, new_g, new_b, new_a)
  {
    for(var ii = 0; ii < layerIndicesArray.length; ii++)
    {
      let laynum = layerIndicesArray[ii];
      if(laynum >= 0 && laynum < this.layers.length)
      {
        this.layers[laynum] = new pixel(new_r, new_g, new_b, new_a);
      }
      else
      {
        window.alert("Your array indices are out of bounds!  See layers.js file for reference.");
      }
    }
  }
  
  // adds a new layer on top
  addLayer(r = 255, g = 255, b = 255, a = 0)
  {
    this.layers.push(new layer(this.width, this.height, r, g, b, a));
  }
  
  // removes a layer by index
  removeLayer(i)
  {
    this.layers.splice(i, 1);
  }
  
  // returns the layer corresponding to what's actually displayed
  // this is what you see when all layers are on top of each other
  // when x and y are null, composite all layers for ALL pixels
  // when x and y are integers, composite only for a single pixel (NOT YET IMPLEMENTED)
  getComposite(x = null, y = null)
  {
    // baselayer needs to be a deep copy of the real base layer
    var baselayer = new layer(this.width, this.height);
    for(var aa = 0; aa < this.layers[0].width; aa++)
    {
      for(var bb = 0; bb < this.layers[0].height; bb++)
      {
        baselayer.pixelData[aa][bb]['r'] = this.layers[0].pixelData[aa][bb]['r'];
        baselayer.pixelData[aa][bb]['g'] = this.layers[0].pixelData[aa][bb]['g'];
        baselayer.pixelData[aa][bb]['b'] = this.layers[0].pixelData[aa][bb]['b'];
        baselayer.pixelData[aa][bb]['a'] = this.layers[0].pixelData[aa][bb]['a'];
      }
    }
    
    // iterate over each layer, bottom up, blending depending on opacity
    for(var ii = 1; ii < this.layers.length; ii++)
    {
      var blendLayer = this.layers[ii];
      // only composite the next layer if it should be displayed (i.e. part of the solo group)
      // otherwise, just skip it
      if(blendLayer.shouldDisplay) // used for when layers are solo'd
      {
        // iterate over the pixel content of each layer, 
        for(var xx = 0; xx < this.layers[ii].width; xx++)
        {
          for(var yy = 0; yy < this.layers[ii].height; yy++)
          {
            // layer compositing calculations based on layer and pixel opacity
            // see here for reference: https://github.com/flrs/blend_modes/blob/master/blend_modes/blend_modes.py
            let a = baselayer.pixelData[xx][yy]['a'];
            let b = blendLayer.pixelData[xx][yy]['a'];
            let ch = Math.min(a, b)*blendLayer.opacity;
            let n = a + (1 - b)*ch;
            let j = 0;
            n == 0 ? j = 0 : j = ch/n;
            
            // I had to add this part myself, it was not in flrs' blend code
            // make sure the blend layer's colors still show up when the baseLayer's alpha is zero!
            // this will be necessary when saving images as png with an alpha channel
            a < 0.001 ? j = 1 : j = j;
            
            // now apply the alpha channelwise (rgb wise)
            // need to be between 0 and 255, and integers, so round
            baselayer.pixelData[xx][yy]['r'] = Math.round(blendLayer.pixelData[xx][yy]['r']*j + baselayer.pixelData[xx][yy]['r']*(1 - j))
            baselayer.pixelData[xx][yy]['g'] = Math.round(blendLayer.pixelData[xx][yy]['g']*j + baselayer.pixelData[xx][yy]['g']*(1 - j))
            baselayer.pixelData[xx][yy]['b'] = Math.round(blendLayer.pixelData[xx][yy]['b']*j + baselayer.pixelData[xx][yy]['b']*(1 - j))
            baselayer.pixelData[xx][yy]['a'] = a + b*blendLayer.opacity - a*b*blendLayer.opacity; // https://stackoverflow.com/a/21492544
          }
        }
      }
    }
    return baselayer;
  }
  
  // set which layers are visible based on which layers are solo'd
  calculateSoloLayerVisibility()
  {
    let temp = this.getSolos()
    for(let ii = 1; ii < this.layers.length; ii++)
    {
      if(temp.length == 0) // no layers are solo'd => all are visible
      {
        this.layers[ii].shouldDisplay = true;
      }
      else if(temp.includes(ii)) // at least one layer is solo'd, so only display solo'd layers
      {
        this.layers[ii].shouldDisplay = true;
      }
      else // this layer is not solo'd, so don't display it
      {
        this.layers[ii].shouldDisplay = false;
      }
    }
  }
  
  // returns an array containing the layer indices of solo'd layers
  getSolos()
  {
    let soloArray = []
    for(let ii = 0; ii < this.layers.length; ii++)
    {
      if(this.layers[ii].isSolo)
      {
        soloArray.push(ii)
      }
    }
    return soloArray;
  }
}

// myComp = new composition(width = 2, height = 1);
// console.log(myComp);
// console.log("\n\n")
// myComp.addLayer();
// myComp.layers[1].pixelData[0][0]['r'] = 40;
// myComp.layers[1].pixelData[0][0]['g'] = 200;
// myComp.layers[1].pixelData[0][0]['a'] = 1.0;
// myComp.layers[1].opacity = 1.0;
// var fi = myComp.getComposite();
// console.log(fi)

export default composition;