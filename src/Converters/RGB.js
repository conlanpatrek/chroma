import padStart from 'lodash/padStart';
import { mod } from 'Color/Utility';

const RGB = {

    toRGB (colorData)
    {
        return colorData;
    },

    toHSL (colorData)
    {
        let r = colorData.RGB.r / 255,
            g = colorData.RGB.g / 255,
            b = colorData.RGB.b / 255,

            cMax = Math.max(r, Math.max(g, b)),
            cMin = Math.min(r, Math.min(g, b)),
            delta = cMax - cMin,
            l = (cMax + cMin) / 2,
            h = delta &&
               (cMax === r ? mod((g - b) / delta, 6) :
                cMax === g ? ((b - r) / delta) + 2 :
                             ((r - g) / delta) + 4) * 60,
            s = delta && delta / ( 1 - Math.abs(2 * l - 1));

        return colorData.set(
            'HSL',
            {
                h,
                s,
                l
            }
        );
    },

    toHSV (colorData)
    {
        let r = colorData.RGB.r / 255,
            g = colorData.RGB.g / 255,
            b = colorData.RGB.b / 255,

            cMax = Math.max(r, Math.max(g, b)),
            cMin = Math.min(r, Math.min(g, b)),
            delta = cMax - cMin;

        return colorData.set(
            'HSV',
            {
                h: delta &&
                   (cMax === r ? mod((g - b) / delta, 6) :
                    cMax === g ? ((b - r) / delta) + 2 :
                                 ((r - g) / delta) + 4) * 60,
                s: cMax && delta / cMax,
                v: cMax
            }
        );
    },

    toHex (colorData)
    {
        let {r, g, b} = colorData.RGB;
        return colorData.set(
            'Hex',
            '#'
            + padStart(Math.round(r).toString(16), 2, '0')
            + padStart(Math.round(g).toString(16), 2, '0')
            + padStart(Math.round(b).toString(16), 2, '0')
        );
    },

    toCMYK (colorData)
    {
        let r = colorData.RGB.r / 255,
            g = colorData.RGB.g / 255,
            b = colorData.RGB.b / 255,
            k = 1 - Math.max(r, Math.max(g, b)),
            c = 1 - k && (1 - r - k) / (1 - k),
            m = 1 - k && (1 - g - k) / (1 - k),
            y = 1 - k && (1 - b - k) / (1 - k);

        return colorData.set(
            'CMYK',
            { c, m, y, k }
        );
    }

};

export default RGB;
