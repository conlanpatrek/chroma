export const COLOR_MODES = [
    'RGB',
    'HSL',
    'HSV',
    'Hex',
    'CMYK',
    'Numeric'
];

export const PREFERRED_CONVERSIONS = {
    RGB: ['Hex', 'CMYK'],
    HSL: ['HSV', 'RGB'],
    HSV: ['HSL', 'RGB'],
    Hex: ['RGB', 'CMYK'],
    CMYK: ['RGB', 'Hex'],
    Numeric: ['RGB', 'Hex', 'CMYK']
};

export const MODE_PROPS = {
    RGB: ['r', 'g', 'b'],
    HSL: ['h', 's', 'l'],
    HSV: ['h', 's', 'v'],
    Hex: (val) => typeof val === 'string',
    CMYK: ['c', 'm', 'y', 'k'],
    Numeric: (val) => typeof val === 'number'
}
