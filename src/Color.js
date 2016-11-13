import ColorData from 'Color/ColorData';
import { COLOR_MODES } from 'Color/Constants';

export default class Color
{
    constructor(data = { r: 0, g: 0, b: 0 })
    {
        this.colorData = ColorData({ RGB: data });
    }
}

for (let mode of COLOR_MODES) {
    let getter = `_get${mode}`,
        setter = `_set${mode}`;
    Color.prototype[mode] = function (value) {
        if (value) {
            this[setter](value);
        }
        return this[getter]();
    };

    Color.prototype[setter] = function (value) {
        this.colorData = ColorData({ [mode]: value });
    };

    Color.prototype[getter] = function (value) {
        this.colorData = this.colorData[`ensure${mode}`]();
        return this.colorData[mode];
    };
}
