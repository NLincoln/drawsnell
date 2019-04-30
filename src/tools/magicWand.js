import {
  TILE_SIZE,
  getPositionOfEventOnElement,
  getPixelCoordsInCanvas,
  getColorAtLayerCoord
} from '../canvasHelpers';

import draw from "./draw";

export default function magicWand(mainComp, tolerance, sourcePosition) 
{

  
  function shouldSelect(source, toChose)
  {
    let willSelect = true;
    
    // if the source alphs is not zero, select based on color difference
    if(Math.abs(source.r - toChose.r) > tolerance)
    {
      willSelect = false;
    }
    if(Math.abs(source.g - toChose.g) > tolerance)
    {
      willSelect = false;
    }
    if(Math.abs(source.b - toChose.b) > tolerance)
    {
      willSelect = false;
    }
    if(toChose.a == 0)
    {
      willSelect = false;
    }
    
    // if the source alpha is zero, select a pixel if its alpha is zero
    if(source.a == 0 && toChose.a == 0)
    {
      willSelect = true;
    }
    else if(source.a == 0)
    {
      willSelect = false;
    }
    
    return willSelect;
  }
  
  let compositeImage = mainComp.getComposite();
  let sourcePix = compositeImage.pixelData[sourcePosition.x][sourcePosition.y];
  
  // non-contiguous operation (just selects all pixels on Canvas within a certain difference threshold)
  let pixlist = []
  for(let xx = 0; xx < mainComp.width; xx++)
  {
    for(let yy = 0; yy < mainComp.height; yy++)
    {
      if(shouldSelect(sourcePix, compositeImage.pixelData[xx][yy]))
      {
        pixlist.push({x:xx, y:yy});
      }
    }
  }
  
  return pixlist;
}