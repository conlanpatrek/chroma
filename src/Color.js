import { ColorData } from 'Chroma/ColorData';
import { COLOR_MODES, MODE_PROPS } from 'Chroma/Constants';

export class Color
{
    /**
     * Constructor
     *
     * @param {*} data 
     */
    constructor(data = { r: 0, g: 0, b: 0 })
    {
        this.colorData = createColorData(data);
    }
}

/**
 * Determine the color mode from the input provided, and use that mode
 * to create a ColorData instance.
 * 
 * @param {*} data 
 */
function createColorData(data)
{
    if (data instanceof ColorData) return data;

    let detected = detectColorMode(data);

    if (detected) {
        return new ColorData({ [detected]: data });
    }

    throw new Error('Can\'t parse color input');
}

/**
 * Determine from the shape of the input which color mode the caller is describing.
 * 
 * @example detectColorMode({r: 0, g: 0, b: 0}); // returns 'RGB'
 *          detectColorMode('#ffffff); // returns 'Hex'
 * @param {*} data An object of some shape. Could be 
 * 
 * @return {string|null} 
 */
function detectColorMode(data) {
    for (let mode in MODE_PROPS) {
        let props = MODE_PROPS[mode];
        if (props instanceof Function && props(data)) return mode;
        if (props instanceof Array && props.reduce((op, prop) => (op && data[prop] !== undefined), true)) return mode;
    }
    return null;
}

// Populate the Color prototype with getter/setters for each color mode.
for (let mode of COLOR_MODES) {
    Color.prototype[mode] = function (value) {
        // Setter, immutable style. Returns new instance.
        if (value) return new Color(new ColorData({ [mode]: value }));

        // Getter
        this.colorData = this.colorData[`ensure${mode}`]();
        return this.colorData[mode];
    };
}
