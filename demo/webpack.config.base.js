var path = require('path'); // eslint-disable-line no-var
var ExtractTextPlugin = require('extract-text-webpack-plugin'); // eslint-disable-line no-var
var autoprefixer = require('autoprefixer'); // eslint-disable-line no-var

module.exports = {
  resolve: {
    alias: {
      'draft-js-markdown-shortcuts-plugin': path.join(__dirname, '..', 'src'),
      react: path.join(__dirname, '..', 'node_modules', 'react'),
    },
    extensions: ['', '.js'],
  },
  module: {
    loaders: [
      {
        // match all js files except example.js
        test: /^(?!.*example\.js$).*\.js$/,
        loaders: ['babel'],
        exclude: /node_modules/,
        include: path.join(__dirname, 'client'),
      }, {
        test: /\.js$/,
        loaders: ['babel'],
        include: [
          path.join(__dirname),
          path.join(__dirname, '..', 'src'),
          path.join(__dirname, 'client')
        ],
      }, {
        test: /\.css$/,
        loader: ExtractTextPlugin.extract('style-loader', 'css-loader?modules&importLoaders=1&localIdentName=[local]___[hash:base64:5]!postcss-loader'),
        include: path.join(__dirname, 'client', 'components'),
      }
    ],
  },
  postcss: [autoprefixer({ browsers: ['> 1%'] })],
};
