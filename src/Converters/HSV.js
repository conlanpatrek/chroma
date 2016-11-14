import RGB from './RGB';
import { mod } from 'Color/Utility';

const HSV = {

    toRGB (colorData)
    {
        let h = mod(colorData.HSV.h, 360),
            {s, v} = colorData.HSV,
            c = v * s,
            x = c * (1 - Math.abs((h / 60) % 2 - 1)),
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
        let { h, s, v } = colorData.HSV,
            c = (2 - s) * v,
            m = (c < 1 ? c : 2 - c);

        return colorData.set(
            'HSL',
            {
                h,
                s: m && (s * v) / m,
                l: c / 2
            }
        );
    },

    toHSV (colorData)
    {
        return colorData;
    },

    toHex (colorData)
    {
        return RGB.toHex(
            HSV.toRGB(colorData)
        );
    },

    toCMYK (colorData)
    {
        return RGB.toCMYK(
            HSV.toRGB(colorData)
        );
    },

    toNumeric (colorData)
    {
        return RGB.toNumeric(
            HSV.toRGB(colorData)
        );
    }

};

export default HSV;
