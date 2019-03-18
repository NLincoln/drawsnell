import bmodes from "./blendModes";

class pixel {
  constructor(r = 255, g = 255, b = 255, a = 1.0) {
    this.r = r;
    this.g = g;
    this.b = b;
    this.a = a;
  }
}

class layer {
  constructor(width = 40, height = 40, r = 255, g = 255, b = 255, a = 1.0) {
    // used for internal calculations
    this.width = width;
    this.height = height;
    this.shouldDisplay = true;
    this.pixelData = [];
    this.blendModeStr = "Normal"
    this.blendMode = bmodes.normal

    // used by GUI primarily
    this.isSolo = false;

    for (let x = 0; x < this.width; x++) {
      this.pixelData.push(new Array(this.height));
      for (let y = 0; y < this.height; y++) {
        this.pixelData[x][y] = new pixel(r, g, b, a);
      }
    }
    this.opacity = 1.0;
  }
}

class composition //extends React.Component
{
  constructor(width = 40, height = 40, r = 255, g = 255, b = 255, a = 1) {
    this.width = width;
    this.height = height;
    let baselayer = new layer(this.width, this.height, r, g, b, a);
    this.layers = [baselayer];
  }

  // updates the pixel at a given x y coord for the given layers to a new value
  updatePixelOnLayers(x, y, layerIndicesArray, new_r, new_g, new_b, new_a) {
    for (let ii = 0; ii < layerIndicesArray.length; ii++) {
      let laynum = layerIndicesArray[ii];
      if (laynum >= 0 && laynum < this.layers.length) {
        this.layers[laynum] = new pixel(new_r, new_g, new_b, new_a);
      }
      else {
        window.alert("Your array indices are out of bounds!  See layers.js file for reference.");
      }
    }
  }

  // adds a new layer on top
  addLayer(r = 255, g = 255, b = 255, a = 0) {
    this.layers.push(new layer(this.width, this.height, r, g, b, a));
  }

  // removes a layer by index
  removeLayer(i) {
    this.layers.splice(i, 1);
  }

  // returns the layer corresponding to what's actually displayed
  // this is what you see when all layers are on top of each other
  // when x and y are null, composite all layers for ALL pixels
  // when x and y are integers, composite only for a single pixel (NOT YET IMPLEMENTED)
  getComposite(x = null, y = null) {
    // baselayer needs to be a deep copy of the real base layer
    let baselayer = new layer(this.width, this.height);
    let transparency_grid = new layer(this.width, this.height);
    for (let aa = 0; aa < this.layers[0].width; aa++) {
      for (let bb = 0; bb < this.layers[0].height; bb++) {
        transparency_grid.pixelData[aa][bb]['r'] = this.layers[0].pixelData[aa][bb]['r'];
        transparency_grid.pixelData[aa][bb]['g'] = this.layers[0].pixelData[aa][bb]['g'];
        transparency_grid.pixelData[aa][bb]['b'] = this.layers[0].pixelData[aa][bb]['b'];
        transparency_grid.pixelData[aa][bb]['a'] = this.layers[0].pixelData[aa][bb]['a'];
        baselayer.pixelData[aa][bb]['a'] = 0;
      }
    }

    // iterate over each layer, bottom up, blending depending on opacity


    for (let ii = 1; ii < this.layers.length; ii++) {
      // let done = false;
      let blendLayer = this.layers[ii];
      let blendFunc = this.layers[ii].blendMode;
      // only composite the next layer if it should be displayed (i.e. part of the solo group)
      // otherwise, just skip it
      if (blendLayer.shouldDisplay) // used for when layers are solo'd
      {
        // iterate over the pixel content of each layer,
        for (let xx = 0; xx < this.layers[ii].width; xx++) {
          for (let yy = 0; yy < this.layers[ii].height; yy++) {
            // layer compositing calculations based on layer and pixel opacity
            // see here for reference: https://github.com/flrs/blend_modes/blob/master/blend_modes/blend_modes.py
            let a = baselayer.pixelData[xx][yy]['a'];
            let b = blendLayer.pixelData[xx][yy]['a'];
            let ch = Math.min(a, b) * blendLayer.opacity;
            let n = a + (1 - b) * ch;
            let j = 0;
            n === 0 ? j = 0 : j = ch / n;

            // I had to add this part myself, it was not in flrs' blend code
            // make sure the blend layer's colors still show up when the baseLayer's alpha is zero!
            // this will be necessary when saving images as png with an alpha channel
            if (a < 0.001)
              j = 1;

            // now apply the alpha channelwise (rgb wise)
            // need to be between 0 and 255, and integers, so round
            if (a !== 0) {
              // the blended color must take the opacity of the layer beneath it into consideration
              // the less the opacity of the base layer, the higher the proprotion of the original top layer with the blended color
              let rr = Math.round(a * (255 * blendFunc(baselayer.pixelData[xx][yy]['r'] / 255.0, blendLayer.pixelData[xx][yy]['r'] / 255.0)) + (1 - a) * blendLayer.pixelData[xx][yy]['r'])
              let gg = Math.round(a * (255 * blendFunc(baselayer.pixelData[xx][yy]['g'] / 255.0, blendLayer.pixelData[xx][yy]['g'] / 255.0)) + (1 - a) * blendLayer.pixelData[xx][yy]['g'])
              let bb = Math.round(a * (255 * blendFunc(baselayer.pixelData[xx][yy]['b'] / 255.0, blendLayer.pixelData[xx][yy]['b'] / 255.0)) + (1 - a) * blendLayer.pixelData[xx][yy]['b'])

              // still have to take the blended color and weight it with this layer's opacity
              baselayer.pixelData[xx][yy]['r'] = Math.round(rr * j + baselayer.pixelData[xx][yy]['r'] * (1 - j))
              baselayer.pixelData[xx][yy]['g'] = Math.round(gg * j + baselayer.pixelData[xx][yy]['g'] * (1 - j))
              baselayer.pixelData[xx][yy]['b'] = Math.round(bb * j + baselayer.pixelData[xx][yy]['b'] * (1 - j))
            }
            else {
              // since the alpha of the base layer is zero, just return this layer; there's no blending to be done
              baselayer.pixelData[xx][yy]['r'] = Math.round(blendLayer.pixelData[xx][yy]['r'] * j + baselayer.pixelData[xx][yy]['r'] * (1 - j))
              baselayer.pixelData[xx][yy]['g'] = Math.round(blendLayer.pixelData[xx][yy]['g'] * j + baselayer.pixelData[xx][yy]['g'] * (1 - j))
              baselayer.pixelData[xx][yy]['b'] = Math.round(blendLayer.pixelData[xx][yy]['b'] * j + baselayer.pixelData[xx][yy]['b'] * (1 - j))
            }
            baselayer.pixelData[xx][yy]['a'] = a + b * blendLayer.opacity - a * b * blendLayer.opacity; // https://stackoverflow.com/a/21492544
          }
        }
      }
    }

    // finally blend finished composite with transparency grid
    for (let xx = 0; xx < this.layers[0].width; xx++) {
      for (let yy = 0; yy < this.layers[0].height; yy++) {
        let a = transparency_grid.pixelData[xx][yy]['a'];
        let b = baselayer.pixelData[xx][yy]['a'];
        let ch = Math.min(a, b) * baselayer.opacity;
        let n = a + (1 - b) * ch;
        let j = 0;
        n === 0 ? j = 0 : j = ch / n;

        baselayer.pixelData[xx][yy]['r'] = Math.round(baselayer.pixelData[xx][yy]['r'] * j + transparency_grid.pixelData[xx][yy]['r'] * (1 - j))
        baselayer.pixelData[xx][yy]['g'] = Math.round(baselayer.pixelData[xx][yy]['g'] * j + transparency_grid.pixelData[xx][yy]['g'] * (1 - j))
        baselayer.pixelData[xx][yy]['b'] = Math.round(baselayer.pixelData[xx][yy]['b'] * j + transparency_grid.pixelData[xx][yy]['b'] * (1 - j))
        baselayer.pixelData[xx][yy]['a'] = 1
      }
    }

    return baselayer;
  }

  // set which layers are visible based on which layers are solo'd
  calculateSoloLayerVisibility() {
    let temp = this.getSolos()
    for (let ii = 1; ii < this.layers.length; ii++) {
      if (temp.length === 0) // no layers are solo'd => all are visible
      {
        this.layers[ii].shouldDisplay = true;
      }
      else if (temp.includes(ii)) // at least one layer is solo'd, so only display solo'd layers
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
  getSolos() {
    let soloArray = []
    for (let ii = 0; ii < this.layers.length; ii++) {
      if (this.layers[ii].isSolo) {
        soloArray.push(ii)
      }
    }
    return soloArray;
  }
}

export default composition;