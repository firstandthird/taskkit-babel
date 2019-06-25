'use strict';

const TaskKitTask = require('taskkit-task');
const babel = require('@babel/core');
const fs = require('fs');
const path = require('path');
const util = require('util');
const writeFile = util.promisify(fs.writeFile);

class BabelTask extends TaskKitTask {
  get description() {
    return 'Compiles your various client-executable files into a minified, source-mapped, browser-compatible js file that you can embed in a webpage';
  }

  // returns the module to load when running in a separate process:
  get classModule() {
    return path.join(__dirname, 'index.js');
  }

  get defaultOptions() {
    return {
      minify: (process.env.NODE_ENV === 'production'),
      sourcemaps: true,
      formats: {
        esm: true,
        cjs: false
      },
      commonjs: {
        enabled: true
      },
      builtins: true,
      babel: {
        babelrc: false,
        exclude: [],
        presets: [],
        plugins: [
          '@babel/plugin-proposal-class-properties',
          '@babel/plugin-proposal-object-rest-spread',
          '@babel/plugin-transform-runtime'
        ]
      }
    };
  }

  async process(input, filename) {
    this.options.builtins = this.options.builtins ? 'entry' : false;
    this.options.babel.sourceMaps = this.options.sourcemaps;
    this.options.babel.minified = this.options.minify;
    const presetConfig = this.options.babel.presetConfig ? this.options.babel.presetConfig : { useBuiltIns: this.options.builtins, modules: false, corejs: 3 };

    this.options.babel.presets = [
      [
        '@babel/preset-env',
        presetConfig
      ]
    ];

    if (this.options.commonjs.enabled) {
      this.options.babel.plugins.push('@babel/plugin-transform-modules-commonjs');
    }

    const { code, map } = await babel.transformFileAsync(input, this.options.babel);

    try {
      await writeFile(filename, code);

      if (map) {
        await writeFile(`${filename}.map`, JSON.stringify(map));
      }
    } catch (error) {
      throw new Error('Error creating dist file');
    }
  }
}
module.exports = BabelTask;
