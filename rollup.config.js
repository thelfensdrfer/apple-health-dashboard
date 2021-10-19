import resolve from '@rollup/plugin-node-resolve'
import babel from '@rollup/plugin-babel'
import json from '@rollup/plugin-json';
import commonjs from '@rollup/plugin-commonjs'
import { terser } from 'rollup-plugin-terser'

export default {
    input: 'js/index.js',
    output: {
        file: 'app.min.js',
        format: 'iife',
        strict: false,
    },
    plugins: [
        resolve({
            browser: true
        }),
        json(),
        commonjs(),
        babel({
            babelHelpers: 'bundled',
        }),
        terser()
    ]
}
