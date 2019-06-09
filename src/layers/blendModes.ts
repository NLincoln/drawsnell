export type Blender = (a: number, b: number) => number;

type BlendModeObj = {
  [x: string]: Blender;
};

export const blendModes: BlendModeObj = {
  normal(a, b) {
    return b;
  },

  overlay(a, b) {
    if (a < 0.5) {
      return 2 * a * b;
    } else {
      return 1 - 2 * (1 - a) * (1 - b);
    }
  },

  add(a, b) {
    return Math.min(a + b, 1.0);
  },

  hard_light(a, b) {
    return this.overlay(b, a);
  },

  soft_light(a, b) {
    if (b < 0.5) {
      return (2 * b - 1) * (a - a * a) + a;
    } else {
      return (2 * b - 1) * (Math.sqrt(a) - a) + a;
    }
  },

  lighten(a, b) {
    return Math.max(a, b);
  },

  screen(a, b) {
    return a + b - a * b; // equivalent to 1 - (1 - a)*(1 - b)
  },

  color_dodge(a, b) {
    if (b !== 1.0) {
      return Math.min(a / (1 - b), 1.0);
    } else {
      return 1.0;
    }
  },

  darken(a, b) {
    return Math.min(a, b);
  },

  multiply(a, b) {
    return Math.min(a * b, 1.0);
  },

  difference(a, b) {
    return Math.abs(a - b);
  },
  subtract(a, b) {
    return Math.max(a - b, 0.0);
  },
  grain_extract(a, b) {
    return Math.min(Math.max(a - b + 0.5, 0.0), 1.0);
  },
  grain_merge(a, b) {
    return Math.min(Math.max(a + b - 0.5, 0.0), 1.0);
  },
  divide(a, b) {
    return Math.min((a * 256.0) / 255.0 / (1.0 / 255.0 + b), 1.0);
  },
  linear_light(a, b) {
    return Math.min(Math.max(a + 2 * b - 1, 0.0), 1.0);
  },
  linear_burn(a, b) {
    return Math.max(a + b - 1, 0.0);
  },

  color_burn(a, b) {
    if (b !== 0.0) {
      return 1.0 - Math.min((1.0 - a) / b, 1.0);
    } else {
      return this.color_dodge(b, a);
    }
  },
  pin_light(a, b) {
    let lowerbound = 2 * b - 1;
    let upperbound = 2 * b;
    if (a < lowerbound) {
      return lowerbound;
    } else if (a > upperbound) {
      return upperbound;
    } else {
      return a;
    }
  },
  // this version is not the color burn used by PhotoShop, but it is used in Photoshop's vivid light function
  old_color_burn(a, b) {
    if (b !== 0.0) {
      return 1.0 - Math.min((1.0 - a) / b, 1.0);
    } else {
      return 0.0;
    }
  },
  vivid_light(a, b) {
    if (b < 0.5) return this.old_color_burn(a, 2 * b);
    else {
      return this.color_dodge(a, 2 * (b - 0.5));
    }
  },
  // this version is not the vivid light used by PhotoShop, but it is used in Photoshop's hard mix function
  new_vivid_light(a, b) {
    if (b < 0.5) {
      return this.color_burn(a, 2 * b);
    } else {
      return this.color_dodge(a, 2 * (b - 0.5));
    }
  },
  hard_mix(a, b) {
    if (this.new_vivid_light(a, b) <= 0.5) {
      return 0.0;
    } else {
      return 1.0;
    }
  },
  exclusion(a, b) {
    return a + b - 2 * a * b;
  },
};
