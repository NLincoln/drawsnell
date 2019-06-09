export type Pixel = {
  r: number;
  g: number;
  b: number;
  a: number;
};

export type Position = {
  x: number;
  y: number;
};

export type Dimensions = {
  width: number;
  height: number;
};

export type Layer = {
  dimensions: Dimensions;
  blendMode: string;
  pixels: Pixel[];
  name: string;
};

export type Composition = {
  dimensions: Dimensions;
  layers: Layer[];
};

const CLEAR_PIXEL: Pixel = {
  r: 0,
  g: 0,
  b: 0,
  a: 0,
};

function getLayerPixel(layer: Layer, position: Position): Pixel {
  return layer.pixels[layer.dimensions.width * position.y + position.x];
}

function setLayerPixels(
  layer: Layer,
  pixel: Pixel,
  positions: Position[],
): Layer {
  let pixels = [...layer.pixels];
  for (let position of positions) {
    pixels[layer.dimensions.width * position.y + position.x] = pixel;
  }
  return {
    ...layer,
    pixels,
  };
}

function createLayer(
  dimensions: Dimensions,
  color: Pixel = CLEAR_PIXEL,
  blendMode: string = "normal",
  name: string = "",
): Layer {
  return {
    dimensions,
    blendMode,
    name,
    pixels: Array.from({ length: dimensions.width * dimensions.height }).map(
      () => color,
    ),
  };
}

export type CompositionAction = {
  type: "UPDATE_PIXELS";
  layer: number;
  positions: Position[];
};

export function compositionReducer(
  composition: Composition,
  action: CompositionAction,
): Composition {
  return composition;
}
