import { mod } from 'Chroma/Utility';
import RGB from './RGB';

const HSL = {

    toRGB (colorData)
    {
        let h = mod(colorData.HSL.h, 360),
            {s, l} = colorData.HSL,
            c = (1 - Math.abs(2 * l - 1)) * s,
            x = c * (1 - Math.abs((h / 60) % 2 - 1)),
            m = l - c/2,
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

        return colorData.set(
            'RGB',
            {
                r: (rPrime + m) * 255,
                g: (gPrime + m) * 255,
                b: (bPrime + m) * 255
            }
        );
    },

    toHSL (colorData)
    {
        return colorData;
    },

    toHSV (colorData)
    {
        let { h, s, l } = colorData.HSL;

        s *= (0.5 - Math.abs(l - 0.5));

        return colorData.set(
            'HSV',
            {
                h: h,
                s: l + s && 2 * s / (l + s),
                v: l + s
            }
        );
    },

    toHex (colorData)
    {
        return RGB.toHex(HSL.toRGB(colorData));
    },

    toCMYK (colorData)
    {
        return RGB.toCMYK(HSL.toRGB(colorData));
    },

    toNumeric (colorData)
    {
        return RGB.toNumeric(HSL.toRGB(colorData));
    },

    toBits (colorData)
    {
        return RGB.toBits(HSL.toRGB(colorData));
    }

};

export default HSL;
