import RGB from './RGB';

const Hex = {

    toRGB (colorData)
    {
        let hex = colorData.Hex;
        return colorData.set(
            'RGB',
            {
                r: parseInt(hex.substring(1, 3), 16),
                g: parseInt(hex.substring(3, 5), 16),
                b: parseInt(hex.substring(5, 7), 16)
            }
        );
    },

    toHSL (colorData)
    {
        return RGB.toHSL(Hex.toRGB(colorData));
    },

    toHSV (colorData)
    {
        return RGB.toHSV(Hex.toRGB(colorData));
    },

    toHex (colorData)
    {
        return colorData;
    },

    toCMYK (colorData)
    {
        return RGB.toCMYK(Hex.toRGB(colorData));
    },

    toNumeric (colorData)
    {
        return colorData.set(
            'Numeric',
            parseInt(colorData.Hex.substring(1), 16)
        );
    },

    toBits (colorData)
    {
        return RGB.toBits(Hex.toRGB(colorData));
    }

};

export default Hex;
