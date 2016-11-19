(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory(require('immutable'), require('lodash/padStart')) :
  typeof define === 'function' && define.amd ? define(['immutable', 'lodash/padStart'], factory) :
  (global.Color = factory(global.immutable,global.padStart));
}(this, (function (immutable,padStart) { 'use strict';

padStart = 'default' in padStart ? padStart['default'] : padStart;

var COLOR_MODES = ['RGB', 'HSL', 'HSV', 'Hex', 'CMYK', 'Numeric', 'Bits'];

var PREFERRED_CONVERSIONS = {
    RGB: ['Hex', 'CMYK'],
    HSL: ['HSV', 'RGB'],
    HSV: ['HSL', 'RGB'],
    Hex: ['RGB', 'CMYK'],
    CMYK: ['RGB', 'Hex'],
    Numeric: ['RGB', 'Hex', 'CMYK'],
    Bits: ['Numeric', 'Hex']
};

var MODE_PROPS = {
    RGB: ['r', 'g', 'b'],
    HSL: ['h', 's', 'l'],
    HSV: ['h', 's', 'v'],
    Hex: function Hex(val) {
        return typeof val === 'string';
    },
    CMYK: ['c', 'm', 'y', 'k'],
    Numeric: function Numeric(val) {
        return typeof val === 'number';
    },
    Bits: function Bits(val) {
        return val instanceof Array;
    }
};

function mod(n, m) {
    return (n % m + m) % m;
}

var RGB = {
    toRGB: function toRGB(colorData) {
        return colorData;
    },
    toHSL: function toHSL(colorData) {
        var r = colorData.RGB.r / 255,
            g = colorData.RGB.g / 255,
            b = colorData.RGB.b / 255,
            cMax = Math.max(r, Math.max(g, b)),
            cMin = Math.min(r, Math.min(g, b)),
            delta = cMax - cMin,
            l = (cMax + cMin) / 2,
            h = delta && (cMax === r ? mod((g - b) / delta, 6) : cMax === g ? (b - r) / delta + 2 : (r - g) / delta + 4) * 60,
            s = delta && delta / (1 - Math.abs(2 * l - 1));

        return colorData.set('HSL', { h: h, s: s, l: l });
    },
    toHSV: function toHSV(colorData) {
        var r = colorData.RGB.r / 255,
            g = colorData.RGB.g / 255,
            b = colorData.RGB.b / 255,
            cMax = Math.max(r, Math.max(g, b)),
            cMin = Math.min(r, Math.min(g, b)),
            delta = cMax - cMin;

        return colorData.set('HSV', {
            h: delta && (cMax === r ? mod((g - b) / delta, 6) : cMax === g ? (b - r) / delta + 2 : (r - g) / delta + 4) * 60,
            s: cMax && delta / cMax,
            v: cMax
        });
    },
    toHex: function toHex(colorData) {
        var _colorData$RGB = colorData.RGB,
            r = _colorData$RGB.r,
            g = _colorData$RGB.g,
            b = _colorData$RGB.b;

        return colorData.set('Hex', '#' + padStart(Math.round(r).toString(16), 2, '0') + padStart(Math.round(g).toString(16), 2, '0') + padStart(Math.round(b).toString(16), 2, '0'));
    },
    toCMYK: function toCMYK(colorData) {
        var r = colorData.RGB.r / 255,
            g = colorData.RGB.g / 255,
            b = colorData.RGB.b / 255,
            k = 1 - Math.max(r, Math.max(g, b)),
            c = 1 - k && (1 - r - k) / (1 - k),
            m = 1 - k && (1 - g - k) / (1 - k),
            y = 1 - k && (1 - b - k) / (1 - k);

        return colorData.set('CMYK', { c: c, m: m, y: y, k: k });
    },
    toNumeric: function toNumeric(colorData) {
        return colorData.set('Numeric', Math.round(colorData.RGB.r) * 0x10000 + Math.round(colorData.RGB.g) * 0x100 + Math.round(colorData.RGB.b));
    },
    toBits: function toBits(colorData) {
        var RGB = colorData.RGB,
            r = Math.round(RGB.r),
            g = Math.round(RGB.g),
            b = Math.round(RGB.b),
            i = 8,
            bits = [];

        while (i--) {
            bits.unshift((b & 1) === 1);
            b = b >> 1;
        }

        i = 8;

        while (i--) {
            bits.unshift((g & 1) === 1);
            g = g >> 1;
        }

        i = 8;

        while (i--) {
            bits.unshift((r & 1) === 1);
            r = r >> 1;
        }

        return colorData.set('Bits', bits);
    }
};

var HSL = {
    toRGB: function toRGB(colorData) {
        var h = mod(colorData.HSL.h, 360),
            _colorData$HSL = colorData.HSL,
            s = _colorData$HSL.s,
            l = _colorData$HSL.l,
            c = (1 - Math.abs(2 * l - 1)) * s,
            x = c * (1 - Math.abs(h / 60 % 2 - 1)),
            m = l - c / 2,
            hPrime = Math.floor(h / 60),
            rPrime = 0,
            gPrime = 0,
            bPrime = 0;


        switch (hPrime) {
            case 0:
                rPrime = c;
                gPrime = x;
                break;
            case 1:
                gPrime = c;
                rPrime = x;
                break;
            case 2:
                gPrime = c;
                bPrime = x;
                break;
            case 3:
                bPrime = c;
                gPrime = x;
                break;
            case 4:
                bPrime = c;
                rPrime = x;
                break;
            case 5:
                rPrime = c;
                bPrime = x;
                break;
        }

        return colorData.set('RGB', {
            r: (rPrime + m) * 255,
            g: (gPrime + m) * 255,
            b: (bPrime + m) * 255
        });
    },
    toHSL: function toHSL(colorData) {
        return colorData;
    },
    toHSV: function toHSV(colorData) {
        var _colorData$HSL2 = colorData.HSL,
            h = _colorData$HSL2.h,
            s = _colorData$HSL2.s,
            l = _colorData$HSL2.l;


        s *= 0.5 - Math.abs(l - 0.5);

        return colorData.set('HSV', {
            h: h,
            s: l + s && 2 * s / (l + s),
            v: l + s
        });
    },
    toHex: function toHex(colorData) {
        return RGB.toHex(HSL.toRGB(colorData));
    },
    toCMYK: function toCMYK(colorData) {
        return RGB.toCMYK(HSL.toRGB(colorData));
    },
    toNumeric: function toNumeric(colorData) {
        return RGB.toNumeric(HSL.toRGB(colorData));
    },
    toBits: function toBits(colorData) {
        return RGB.toBits(HSL.toRGB(colorData));
    }
};

var HSV = {
    toRGB: function toRGB(colorData) {
        var h = mod(colorData.HSV.h, 360),
            _colorData$HSV = colorData.HSV,
            s = _colorData$HSV.s,
            v = _colorData$HSV.v,
            c = v * s,
            x = c * (1 - Math.abs(h / 60 % 2 - 1)),
            m = v - c,
            hPrime = Math.floor(h / 60),
            rPrime = 0,
            gPrime = 0,
            bPrime = 0;


        switch (hPrime) {
            case 0:
                rPrime = c;
                gPrime = x;
                break;
            case 1:
                gPrime = c;
                rPrime = x;
                break;
            case 2:
                gPrime = c;
                bPrime = x;
                break;
            case 3:
                bPrime = c;
                gPrime = x;
                break;
            case 4:
                bPrime = c;
                rPrime = x;
                break;
            case 5:
                rPrime = c;
                bPrime = x;
                break;
        }

        return colorData.set('RGB', {
            r: (rPrime + m) * 255,
            g: (gPrime + m) * 255,
            b: (bPrime + m) * 255
        });
    },
    toHSL: function toHSL(colorData) {
        var _colorData$HSV2 = colorData.HSV,
            h = _colorData$HSV2.h,
            s = _colorData$HSV2.s,
            v = _colorData$HSV2.v,
            c = (2 - s) * v,
            m = c < 1 ? c : 2 - c;


        return colorData.set('HSL', {
            h: h,
            s: m && s * v / m,
            l: c / 2
        });
    },
    toHSV: function toHSV(colorData) {
        return colorData;
    },
    toHex: function toHex(colorData) {
        return RGB.toHex(HSV.toRGB(colorData));
    },
    toCMYK: function toCMYK(colorData) {
        return RGB.toCMYK(HSV.toRGB(colorData));
    },
    toNumeric: function toNumeric(colorData) {
        return RGB.toNumeric(HSV.toRGB(colorData));
    },
    toBits: function toBits(colorData) {
        return RGB.toBits(HSV.toRGB(colorData));
    }
};

var Hex$1 = {
    toRGB: function toRGB(colorData) {
        var hex = colorData.Hex;
        return colorData.set('RGB', {
            r: parseInt(hex.substring(1, 3), 16),
            g: parseInt(hex.substring(3, 5), 16),
            b: parseInt(hex.substring(5, 7), 16)
        });
    },
    toHSL: function toHSL(colorData) {
        return RGB.toHSL(Hex$1.toRGB(colorData));
    },
    toHSV: function toHSV(colorData) {
        return RGB.toHSV(Hex$1.toRGB(colorData));
    },
    toHex: function toHex(colorData) {
        return colorData;
    },
    toCMYK: function toCMYK(colorData) {
        return RGB.toCMYK(Hex$1.toRGB(colorData));
    },
    toNumeric: function toNumeric(colorData) {
        return colorData.set('Numeric', parseInt(colorData.Hex.substring(1), 16));
    },
    toBits: function toBits(colorData) {
        return RGB.toBits(Hex$1.toRGB(colorData));
    }
};

var CMYK = {
    toRGB: function toRGB(colorData) {
        var _colorData$CMYK = colorData.CMYK,
            c = _colorData$CMYK.c,
            m = _colorData$CMYK.m,
            y = _colorData$CMYK.y,
            k = _colorData$CMYK.k;

        return colorData.set('RGB', {
            r: 255 * (1 - c) * (1 - k),
            g: 255 * (1 - m) * (1 - k),
            b: 255 * (1 - y) * (1 - k)
        });
    },
    toHSL: function toHSL(colorData) {
        return RGB.toHSL(CMYK.toRGB(colorData));
    },
    toHSV: function toHSV(colorData) {
        return RGB.toHSV(CMYK.toRGB(colorData));
    },
    toHex: function toHex(colorData) {
        return RGB.toHex(CMYK.toRGB(colorData));
    },
    toCMYK: function toCMYK(colorData) {
        return colorData;
    },
    toNumeric: function toNumeric(colorData) {
        return RGB.toNumeric(CMYK.toRGB(colorData));
    },
    toBits: function toBits(colorData) {
        return RGB.toBits(CMYK.toRGB(colorData));
    }
};

var Numeric$1 = {
    toRGB: function toRGB(colorData) {
        return colorData.set('RGB', {
            r: Math.floor(colorData.Numeric / 0x10000),
            g: Math.floor(colorData.Numeric % 0x10000 / 0x100),
            b: colorData.Numeric % 0x100
        });
    },
    toHSL: function toHSL(colorData) {
        return RGB.toHSL(Numeric$1.toRGB(colorData));
    },
    toHSV: function toHSV(colorData) {
        return RGB.toHSV(Numeric$1.toRGB(colorData));
    },
    toHex: function toHex(colorData) {
        return RGB.toHex(Numeric$1.toRGB(colorData));
    },
    toCMYK: function toCMYK(colorData) {
        return RGB.toCMYK(Numeric$1.toRGB(colorData));
    },
    toNumeric: function toNumeric(colorData) {
        return colorData;
    },
    toBits: function toBits(colorData) {
        var numeric = colorData.Numeric,
            i = 24,
            bits = [];

        while (i--) {
            bits.unshift((numeric & 1) === 1);
            numeric = numeric >> 1;
        }

        return colorData.set('Bits', bits);
    }
};

var Bits$1 = {
    toRGB: function toRGB(colorData) {
        return colorData.set('RGB', colorData.Bits.reduce(function (rgb, bit, i) {
            if (i < 8) {
                rgb.r = rgb.r << 1 | bit;
            } else if (i < 16) {
                rgb.g = rgb.g << 1 | bit;
            } else {
                rgb.b = rgb.b << 1 | bit;
            }
            return rgb;
        }, { r: 0, g: 0, b: 0 }));
    },
    toHSL: function toHSL(colorData) {
        return RGB.toHSL(Bits$1.toRGB(colorData));
    },
    toHSV: function toHSV(colorData) {
        return RGB.toHSV(Bits$1.toRGB(colorData));
    },
    toHex: function toHex(colorData) {
        return RGB.toHex(Bits$1.toRGB(colorData));
    },
    toCMYK: function toCMYK(colorData) {
        return RGB.toCMYK(Bits$1.toRGB(colorData));
    },
    toNumeric: function toNumeric(colorData) {
        return colorData.set('Numeric', colorData.Bits.reduce(function (hex, bit) {
            return hex << 1 | bit;
        }, 0));
    },
    toBits: function toBits(colorData) {
        return colorData;
    }
};

var Null = {
    toRGB: function toRGB(colorData) {
        return colorData;
    },
    toHSL: function toHSL(colorData) {
        return colorData;
    },
    toHSV: function toHSV(colorData) {
        return colorData;
    },
    toHex: function toHex(colorData) {
        return colorData;
    },
    toCMYK: function toCMYK(colorData) {
        return colorData;
    },
    toNumeric: function toNumeric(colorData) {
        return colorData;
    },
    toBits: function toBits(colorData) {
        return colorData;
    }
};

var Converters = {
    RGB: RGB,
    HSL: HSL,
    HSV: HSV,
    Hex: Hex$1,
    CMYK: CMYK,
    Numeric: Numeric$1,
    Bits: Bits$1,
    Null: Null
};

var asyncGenerator = function () {
  function AwaitValue(value) {
    this.value = value;
  }

  function AsyncGenerator(gen) {
    var front, back;

    function send(key, arg) {
      return new Promise(function (resolve, reject) {
        var request = {
          key: key,
          arg: arg,
          resolve: resolve,
          reject: reject,
          next: null
        };

        if (back) {
          back = back.next = request;
        } else {
          front = back = request;
          resume(key, arg);
        }
      });
    }

    function resume(key, arg) {
      try {
        var result = gen[key](arg);
        var value = result.value;

        if (value instanceof AwaitValue) {
          Promise.resolve(value.value).then(function (arg) {
            resume("next", arg);
          }, function (arg) {
            resume("throw", arg);
          });
        } else {
          settle(result.done ? "return" : "normal", result.value);
        }
      } catch (err) {
        settle("throw", err);
      }
    }

    function settle(type, value) {
      switch (type) {
        case "return":
          front.resolve({
            value: value,
            done: true
          });
          break;

        case "throw":
          front.reject(value);
          break;

        default:
          front.resolve({
            value: value,
            done: false
          });
          break;
      }

      front = front.next;

      if (front) {
        resume(front.key, front.arg);
      } else {
        back = null;
      }
    }

    this._invoke = send;

    if (typeof gen.return !== "function") {
      this.return = undefined;
    }
  }

  if (typeof Symbol === "function" && Symbol.asyncIterator) {
    AsyncGenerator.prototype[Symbol.asyncIterator] = function () {
      return this;
    };
  }

  AsyncGenerator.prototype.next = function (arg) {
    return this._invoke("next", arg);
  };

  AsyncGenerator.prototype.throw = function (arg) {
    return this._invoke("throw", arg);
  };

  AsyncGenerator.prototype.return = function (arg) {
    return this._invoke("return", arg);
  };

  return {
    wrap: function (fn) {
      return function () {
        return new AsyncGenerator(fn.apply(this, arguments));
      };
    },
    await: function (value) {
      return new AwaitValue(value);
    }
  };
}();





var classCallCheck = function (instance, Constructor) {
  if (!(instance instanceof Constructor)) {
    throw new TypeError("Cannot call a class as a function");
  }
};







var defineProperty = function (obj, key, value) {
  if (key in obj) {
    Object.defineProperty(obj, key, {
      value: value,
      enumerable: true,
      configurable: true,
      writable: true
    });
  } else {
    obj[key] = value;
  }

  return obj;
};

var get = function get(object, property, receiver) {
  if (object === null) object = Function.prototype;
  var desc = Object.getOwnPropertyDescriptor(object, property);

  if (desc === undefined) {
    var parent = Object.getPrototypeOf(object);

    if (parent === null) {
      return undefined;
    } else {
      return get(parent, property, receiver);
    }
  } else if ("value" in desc) {
    return desc.value;
  } else {
    var getter = desc.get;

    if (getter === undefined) {
      return undefined;
    }

    return getter.call(receiver);
  }
};

















var set = function set(object, property, value, receiver) {
  var desc = Object.getOwnPropertyDescriptor(object, property);

  if (desc === undefined) {
    var parent = Object.getPrototypeOf(object);

    if (parent !== null) {
      set(parent, property, value, receiver);
    }
  } else if ("value" in desc && desc.writable) {
    desc.value = value;
  } else {
    var setter = desc.set;

    if (setter !== undefined) {
      setter.call(receiver, value);
    }
  }

  return value;
};















var toConsumableArray = function (arr) {
  if (Array.isArray(arr)) {
    for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) arr2[i] = arr[i];

    return arr2;
  } else {
    return Array.from(arr);
  }
};

var ColorData = immutable.Record(COLOR_MODES.reduce(function (op, mode) {
    op[mode] = null;
    return op;
}, {}));

ColorData.prototype._getConverter = function (target) {
    var method = 'to' + target,
        converter = ColorData.Converters.Null,
        preferred = PREFERRED_CONVERSIONS[target] || [];

    var _arr = [].concat(toConsumableArray(preferred), toConsumableArray(COLOR_MODES));

    for (var _i = 0; _i < _arr.length; _i++) {
        var source = _arr[_i];
        if (this[source] !== null) {
            converter = ColorData.Converters[source];
        }
    }

    return converter[method];
};

var _iteratorNormalCompletion$1 = true;
var _didIteratorError$1 = false;
var _iteratorError$1 = undefined;

try {
    var _loop$1 = function _loop$1() {
        var mode = _step$1.value;

        ColorData.prototype['ensure' + mode] = function () {
            if (this[mode] === null) {
                return this._getConverter(mode)(this);
            }
            return this;
        };
    };

    for (var _iterator$1 = COLOR_MODES[Symbol.iterator](), _step$1; !(_iteratorNormalCompletion$1 = (_step$1 = _iterator$1.next()).done); _iteratorNormalCompletion$1 = true) {
        _loop$1();
    }
} catch (err) {
    _didIteratorError$1 = true;
    _iteratorError$1 = err;
} finally {
    try {
        if (!_iteratorNormalCompletion$1 && _iterator$1.return) {
            _iterator$1.return();
        }
    } finally {
        if (_didIteratorError$1) {
            throw _iteratorError$1;
        }
    }
}

ColorData.Converters = Converters;

var Color = function Color() {
    var data = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : { r: 0, g: 0, b: 0 };
    classCallCheck(this, Color);

    this.colorData = ColorDataFactory(data);
};

function ColorDataFactory(input) {
    if (input instanceof ColorData) return input;

    var detected = null;
    for (var mode in MODE_PROPS) {
        var props = MODE_PROPS[mode];
        if (props instanceof Array) {
            if (props.reduce(function (op, prop) {
                return op && input[prop] !== undefined;
            }, true)) {
                detected = mode;
            }
        } else {
            if (props(input)) {
                detected = mode;
            }
        }
    }

    if (detected) {
        return new ColorData(defineProperty({}, detected, input));
    }

    throw new Error('Can\'t parse color input');
}

var _iteratorNormalCompletion = true;
var _didIteratorError = false;
var _iteratorError = undefined;

try {
    var _loop = function _loop() {
        var mode = _step.value;

        var getter = '_get' + mode,
            setter = '_set' + mode;
        Color.prototype[mode] = function (value) {
            if (value) {
                return this[setter](value);
            }
            return this[getter]();
        };

        Color.prototype[setter] = function (value) {
            return new Color(ColorData(defineProperty({}, mode, value)));
        };

        Color.prototype[getter] = function (value) {
            this.colorData = this.colorData['ensure' + mode]();
            return this.colorData[mode];
        };
    };

    for (var _iterator = COLOR_MODES[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
        _loop();
    }
} catch (err) {
    _didIteratorError = true;
    _iteratorError = err;
} finally {
    try {
        if (!_iteratorNormalCompletion && _iterator.return) {
            _iterator.return();
        }
    } finally {
        if (_didIteratorError) {
            throw _iteratorError;
        }
    }
}

return Color;

})));
