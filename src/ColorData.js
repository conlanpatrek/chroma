import { COLOR_MODES, PREFERRED_CONVERSIONS } from 'Chroma/Constants';
import Converters from 'Chroma/Converters';

/**
 * @class ColorData
 *
 * Includes properties for each color mode.
 */
export class ColorData {
    /**
     * Constructor
     *
     * Initialize color modes from the provided data.
     *
     * @param {object<string, *>} initial 
     */
    constructor(initial = {}) {
        COLOR_MODES.forEach((mode) => {
            this[mode] = (initial[mode] !== undefined) ? initial[mode] : null;
        })
    }

    /**
     * Get mode data.
     *
     * @param {string} mode 
     *
     * @return {*}
     */
    get(mode) {
        return this[mode];
    }

    /**
     * Set mode data.
     *
     * @param {string} mode 
     * @param {*} value 
     *
     * @return ColorData
     */
    set(mode, value) {
        const clone = new ColorData(this);
        clone[mode] = value;
        return clone;
    }

    /**
     * Determine from the data currently available on this instance how to get the values for
     * the provided mode, and return that function.
     *
     * @param {string} target The color mode we're converting to.
     *
     * @return {(ColorData) => ColorData}
     */
    _getConverter(target) {
        let method = `to${target}`,
            converter = ColorData.Converters.Null,
            preferred = PREFERRED_CONVERSIONS[target] || [];
    
        for (let source of [ ...preferred, ...COLOR_MODES ]) {
            if (this[source] !== null) {
                converter = ColorData.Converters[source];
            }
        }
    
        return converter[method];
    }
}

// Populate ColorData prototype with a list of color mode
for (let mode of COLOR_MODES) {
    ColorData.prototype[`ensure${mode}`] = function() {
        if (this[mode] === null) {
            return this._getConverter(mode)(this)
        }
        return this;
    };
}

ColorData.Converters = Converters;
