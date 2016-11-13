import { Record } from 'immutable';
import { COLOR_MODES, PREFERRED_CONVERSIONS } from 'Color/Constants';
import Converters from 'Color/Converters';

const ColorData = Record(
    COLOR_MODES.reduce((op, mode) => {
        op[mode] = null;
        return op;
    }, {})
);

ColorData.prototype._getConverter = function (target) {
    let method = `to${target}`,
        converter = ColorData.Converters.Null,
        preferred = PREFERRED_CONVERSIONS[target] || [];

    for (let source of [ ...preferred, ...COLOR_MODES ]) {
        if (this[source] !== null) {
            converter = ColorData.Converters[source];
        }
    }

    return converter[method];
};

for (let mode of COLOR_MODES) {
    ColorData.prototype[`ensure${mode}`] = function() {
        if (this[mode] === null) {
            return this._getConverter(mode)(this)
        }
        return this;
    };
}

ColorData.Converters = Converters;

export default ColorData;
