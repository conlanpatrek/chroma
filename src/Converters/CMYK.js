import RGB from './RGB';

const CMYK = {

    toRGB (colorData)
    {
        let { c, m, y, k } = colorData.CMYK;
        return colorData.set(
            'RGB',
            {
                r: 255 * (1 - c) * (1 - k),
                g: 255 * (1 - m) * (1 - k),
                b: 255 * (1 - y) * (1 - k)
            }
        );
    },

    toHSL (colorData)
    {
        return RGB.toHSL(CMYK.toRGB(colorData));
    },

    toHSV (colorData)
    {
        return RGB.toHSV(CMYK.toRGB(colorData));
    },

    toHex (colorData)
    {
        return RGB.toHex(CMYK.toRGB(colorData));
    },

    toCMYK (colorData)
    {
        return colorData;
    },

    toNumeric (colorData)
    {
        return RGB.toNumeric(CMYK.toRGB(colorData));
    },

    toBits (colorData)
    {
        return RGB.toBits(CMYK.toRGB(colorData));
    }

};

export default CMYK;
