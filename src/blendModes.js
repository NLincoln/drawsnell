// simple class containing functions for blending modes
class bmodes {
  // a is base layer, b is blend layer (blend goes on top of base)
  static normal(a, b) {
    return b
  }

  static overlay(a, b) {
    if (a < 0.5) {
      return 2 * a * b;
    }
    else {
      return 1 - 2 * (1 - a) * (1 - b);
    }
  }

  static add(a, b) {
    return Math.min(a + b, 1.0)
  }

  static hard_light(a, b) {
    return bmodes.overlay(b, a)
  }

  static soft_light(a, b) {
    if (b < 0.5) { return (2 * b - 1) * (a - a * a) + a }
    else { return (2 * b - 1) * (Math.sqrt(a) - a) + a }
  }

  static lighten(a, b) {
    return Math.max(a, b)
  }

  static screen(a, b) {
    return a + b - a * b // equivalent to 1 - (1 - a)*(1 - b)
  }

  static color_dodge(a, b) {
    if (b !== 1.0) { return Math.min(a / (1 - b), 1.0) }
    else { return 1.0 }
  }

  static darken(a, b) {
    return Math.min(a, b)
  }

  static multiply(a, b) {
    return Math.min(a * b, 1.0)
  }

  static difference(a, b) {
    return Math.abs(a - b)
  }

  static subtract(a, b) {
    return Math.max(a - b, 0.0)
  }

  static grain_extract(a, b) {
    return Math.min(Math.max(a - b + 0.5, 0.0), 1.0)
  }

  static grain_merge(a, b) {
    return Math.min(Math.max(a + b - 0.5, 0.0), 1.0)
  }

  static divide(a, b) {
    return Math.min((a * 256.0 / 255.0) / (1.0 / 255.0 + b), 1.0)
  }

  static linear_light(a, b) {
    return Math.min(Math.max(a + 2 * b - 1, 0.0), 1.0)
  }

  static linear_burn(a, b) {
    return Math.max(a + b - 1, 0.0)
  }

  static color_burn(a, b) {
    if (b !== 0.0) { return 1.0 - Math.min((1.0 - a) / b, 1.0) }
    else { return bmodes.color_dodge(b, a) }
  }

  static pin_light(a, b) {
    let lowerbound = 2 * b - 1
    let upperbound = 2 * b
    if (a < lowerbound) { return lowerbound }
    else if (a > upperbound) { return upperbound }
    else { return a }
  }

  // this version is not the color burn used by PhotoShop, but it is used in Photoshop's vivid light function
  static old_color_burn(a, b) {
    if (b !== 0.0) { return 1.0 - Math.min((1.0 - a) / b, 1.0) }
    else { return 0.0 }
  }

  static vivid_light(a, b) {
    if (b < 0.5)
      return bmodes.old_color_burn(a, 2 * b)
    else { return bmodes.color_dodge(a, 2 * (b - 0.5)) }
  }

  // this version is not the vivid light used by PhotoShop, but it is used in Photoshop's hard mix function
  static new_vivid_light(a, b) {
    if (b < 0.5) { return bmodes.color_burn(a, 2 * b) }
    else { return bmodes.color_dodge(a, 2 * (b - 0.5)) }
  }

  static hard_mix(a, b) {
    if (bmodes.new_vivid_light(a, b) <= 0.5) { return 0.0 }
    else { return 1.0 }
  }

  static exclusion(a, b) {
    return a + b - 2 * a * b
  }

  static lookup = {
    "Normal": bmodes.normal,
    "Overlay": bmodes.overlay,
    "Add": bmodes.add,
    "Hard Light": bmodes.hard_light,
    "Soft Light": bmodes.soft_light,
    "Lighten": bmodes.lighten,
    "Screen": bmodes.screen,
    "Color Dodge": bmodes.color_dodge,
    "Darken": bmodes.darken,
    "Multiply": bmodes.multiply,
    "Difference": bmodes.difference,
    "Subtract": bmodes.subtract,
    "Grain Extract": bmodes.grain_extract,
    "Grain Merge": bmodes.grain_merge,
    "Divide": bmodes.divide,
    "Linear Light": bmodes.linear_light,
    "Linear Burn": bmodes.linear_burn,
    "Color Burn": bmodes.color_burn,
    "Pin Light": bmodes.pin_light,
    "Vivid Light": bmodes.vivid_light,
    "Hard Mix": bmodes.hard_mix,
    "Exclusion": bmodes.exclusion
  }
}


export default bmodes