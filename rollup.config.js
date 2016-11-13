import path from 'path';
import fs from 'fs';
import babel from 'rollup-plugin-babel';
import commonjs from 'rollup-plugin-commonjs';

let babelrc = JSON.parse(fs.readFileSync('./.babelrc', 'utf-8')),
    rollupBabelrc = Object.assign(
    {},
    babelrc,
    {
        // Replace es2015 with es2015-rollup in presets
        presets: babelrc.presets.map(preset => preset === 'es2015' ? 'es2015-rollup' : preset),
        babelrc: false
    }
);

export default {
    entry: 'src/Color.js',
    format: 'umd',
    dest: 'dist/Color.js',
    plugins: [
        commonjs({
            namedExports: {
                immutable: ['Record']
            }
        }),
        babel(rollupBabelrc)
    ],
    moduleName: 'Color'
};
