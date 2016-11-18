import RGB from './RGB';

const Numeric = {

    toRGB (colorData)
    {
        return colorData.set(
            'RGB',
            {
                r: Math.floor(colorData.Numeric / 0x10000),
                g: Math.floor((colorData.Numeric % 0x10000) / 0x100),
                b: colorData.Numeric % 0x100
            }
        );
    },

    toHSL (colorData)
    {
        return RGB.toHSL(
            Numeric.toRGB(colorData)
        );
    },

    toHSV (colorData)
    {
        return RGB.toHSV(
            Numeric.toRGB(colorData)
        );
    },

    toHex (colorData)
    {
        return RGB.toHex(
            Numeric.toRGB(colorData)
        );
    },

    toCMYK (colorData)
    {
        return RGB.toCMYK(
            Numeric.toRGB(colorData)
        );
    },

    toNumeric (colorData)
    {
        return colorData;
    },

    toBits (colorData)
    {
        let numeric = colorData.Numeric,
            i = 24,
            bits = [];

        while (i--) {
            bits.unshift((numeric & 1) === 1);
            numeric = numeric >> 1;
        }

        return colorData.set('Bits', bits);
    }

};

export default Numeric;
