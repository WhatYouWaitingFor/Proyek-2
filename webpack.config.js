const path = require('path');
const loaders = require('./webpack.loaders');
const plugins = require('./webpack.plugins');

module.exports = {
  entry: './src/index.js',
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'bundle.js'
  },
  mode: 'production',
  module: {
    rules: loaders
  },
  plugins: plugins
};