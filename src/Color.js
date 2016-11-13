import ColorData from 'Color/ColorData';
import { COLOR_MODES, MODE_PROPS } from 'Color/Constants';

export default class Color
{
    constructor(data = { r: 0, g: 0, b: 0 })
    {
        this.colorData = ColorDataFactory(data);
    }
}

function ColorDataFactory(input)
{
    let detected = null;
    for (let mode in MODE_PROPS) {
        let props = MODE_PROPS[mode];
        if (props instanceof Array) {
            if (
                props.reduce(
                    (op, prop) => {
                        return op && input[prop] !== undefined;
                    },
                    true
                )
            ) {
                detected = mode;
            }
        } else {
            if (props(input)) {
                detected = mode;
            }
        }
    }

    if (detected) {
        return new ColorData({ [detected]: input });
    }

    throw new Error('Can\'t parse color input');
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
