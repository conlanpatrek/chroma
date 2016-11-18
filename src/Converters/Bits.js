import RGB from './RGB';

const Bits = {

    toRGB (colorData)
    {
        return colorData.set(
            'RGB',
            colorData.Bits.reduce(
                (rgb, bit, i) => {
                    if (i < 8) {
                        rgb.r = (rgb.r << 1 | bit);
                    } else if (i < 16) {
                        rgb.g = (rgb.g << 1 | bit);
                    } else {
                        rgb.b = (rgb.b << 1 | bit);
                    }
                    return rgb;
                },
                {r: 0, g: 0, b: 0}
            )
        );
    },

    toHSL (colorData)
    {
        return RGB.toHSL(Bits.toRGB(colorData));
    },

    toHSV (colorData)
    {
        return RGB.toHSV(Bits.toRGB(colorData));
    },

    toHex (colorData)
    {
        return RGB.toHex(Bits.toRGB(colorData));
    },

    toCMYK (colorData)
    {
        return RGB.toCMYK(Bits.toRGB(colorData));
    },

    toNumeric (colorData)
    {
        return colorData.set(
            'Numeric',
            colorData.Bits.reduce((hex, bit) => (hex << 1 | bit), 0)
        );
    },

    toBits (colorData)
    {
        return colorData;
    }

};

export default Bits;
