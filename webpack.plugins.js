const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = [
  /* HTML Webpack Plugin */
  new HtmlWebpackPlugin({
    template: './src/template.html',
    filename: 'index.html'
  })
];