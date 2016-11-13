import { Record } from 'immutable';
import { COLOR_MODES } from 'Color/Constants';
import Converters from 'Color/Converters';

const ColorData = Record(
    COLOR_MODES.reduce((op, mode) => {
        op[mode] = null;
        return op;
    }, {})
);

ColorData.prototype._getConverter = function () {
    for (let mode of COLOR_MODES) {
        if (this[mode] !== null) {
            return ColorData.Converters[mode];
        }
    }
    return ColorData.Converters.Null;
};

for (let mode of COLOR_MODES) {
    ColorData.prototype[`ensure${mode}`] = function() {
        if (this[mode] === null) {
            return this._getConverter()[`to${mode}`](this)
        }
        return this;
    };
}

ColorData.Converters = Converters;

export default ColorData;
