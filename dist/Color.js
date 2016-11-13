(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory(require('immutable'), require('lodash/padStart')) :
  typeof define === 'function' && define.amd ? define(['immutable', 'lodash/padStart'], factory) :
  (global.Color = factory(global.immutable,global.padStart));
}(this, (function (immutable,padStart) { 'use strict';

padStart = 'default' in padStart ? padStart['default'] : padStart;

var COLOR_MODES = ['RGB', 'HSL', 'HSV', 'CMYK', 'Hex'];

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

        return colorData.set('HSL', {
            h: h,
            s: s,
            l: l
        });
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
        return RGB.toHex(this.toRGB(colorData));
    },
    toCMYK: function toCMYK(colorData) {
        return RGB.toCMYK(this.toRGB(colorData));
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
        return RGB.toHex(this.toRGB(colorData));
    },
    toCMYK: function toCMYK(colorData) {
        return RGB.toCMYK(this.toRGB(colorData));
    }
};

var Hex = {
    toRGB: function toRGB(colorData) {
        var hex = colorData.Hex;
        return colorData.set('RGB', {
            r: parseInt(hex.substring(1, 3), 16),
            g: parseInt(hex.substring(3, 5), 16),
            b: parseInt(hex.substring(5, 7), 16)
        });
    },
    toHSL: function toHSL(colorData) {
        return RGB.toHSL(this.toRGB(colorData));
    },
    toHSV: function toHSV(colorData) {
        return RGB.toHSV(this.toRGB(colorData));
    },
    toHex: function toHex(colorData) {
        return colorData;
    },
    toCMYK: function toCMYK(colorData) {
        return RGB.toCMYK(this.toRGB(colorData));
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
        return RGB.toHSL(this.toRGB(colorData));
    },
    toHSV: function toHSV(colorData) {
        return RGB.toHSV(this.toRGB(colorData));
    },
    toHex: function toHex(colorData) {
        return RGB.toHex(this.toRGB(colorData));
    },
    toCMYK: function toCMYK(colorData) {
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
    }
};

var Converters = {
    RGB: RGB,
    HSL: HSL,
    HSV: HSV,
    Hex: Hex,
    CMYK: CMYK,
    Null: Null
};

var ColorData = immutable.Record(COLOR_MODES.reduce(function (op, mode) {
    op[mode] = null;
    return op;
}, {}));

ColorData.prototype._getConverter = function () {
    var _iteratorNormalCompletion = true;
    var _didIteratorError = false;
    var _iteratorError = undefined;

    try {
        for (var _iterator = COLOR_MODES[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
            var mode = _step.value;

            if (this[mode] !== null) {
                return ColorData.Converters[mode];
            }
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

    return ColorData.Converters.Null;
};

var _iteratorNormalCompletion2 = true;
var _didIteratorError2 = false;
var _iteratorError2 = undefined;

try {
    var _loop$1 = function _loop$1() {
        var mode = _step2.value;

        ColorData.prototype['ensure' + mode] = function () {
            if (this[mode] === null) {
                return this._getConverter()['to' + mode](this);
            }
            return this;
        };
    };

    for (var _iterator2 = COLOR_MODES[Symbol.iterator](), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
        _loop$1();
    }
} catch (err) {
    _didIteratorError2 = true;
    _iteratorError2 = err;
} finally {
    try {
        if (!_iteratorNormalCompletion2 && _iterator2.return) {
            _iterator2.return();
        }
    } finally {
        if (_didIteratorError2) {
            throw _iteratorError2;
        }
    }
}

ColorData.Converters = Converters;

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

var Color = function Color() {
    var data = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : { r: 0, g: 0, b: 0 };
    classCallCheck(this, Color);

    this.colorData = ColorData({ RGB: data });
};

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
                this[setter](value);
            }
            return this[getter]();
        };

        Color.prototype[setter] = function (value) {
            this.colorData = ColorData(defineProperty({}, mode, value));
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