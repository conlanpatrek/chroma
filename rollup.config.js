import { uglify } from 'rollup-plugin-uglify';
import babel from 'rollup-plugin-babel';
import node from 'rollup-plugin-node-resolve';

const minify = !!process.env.minify;

export default {
    input: 'src/Chroma.js',
    output: {
        file: minify ? 'dist/Chroma.min.js' : 'dist/Chroma.js',
        name: 'Chroma',
        format: 'umd'
    },
    plugins: [
        node(),
        babel(),
        minify && uglify()
    ]
};
