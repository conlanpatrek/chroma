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
        return RGB.toHSL(
            this.toRGB(colorData)
        );
    },

    toHSV (colorData)
    {
        return RGB.toHSV(
            this.toRGB(colorData)
        );
    },

    toHex (colorData)
    {
        return RGB.toHex(
            this.toRGB(colorData)
        );
    },

    toCMYK (colorData)
    {
        return colorData;
    }


};

export default CMYK;
