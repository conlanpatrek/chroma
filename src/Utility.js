/**
 * Safe mod. Accounts for negative numbers. Always returns the positive mod.
 * 
 * @param {number} n The number to mod.
 * @param {number} modulo The number to mod by.
 * 
 * @returns {number} The adjusted mod result.
 */
export function mod(n, modulo) {
    return ((n % modulo) + modulo) % modulo;
}

/**
 * Naive left pad. Ensure a string is at least {len} in length by prepending the string
 * with a repeated character.
 * 
 * @param {string} inp A string to pad.
 * @param {number} len Length the output string must be.
 * @param {string} char The character to use to pad the string.
 * 
 * @return {string} The paded string.
 */
export function padStart(inp, len, char) {
    while (inp.length < len) {
        inp = char + inp; 
    }
    return inp;
}
