const path = require('path');

module.exports = {
  mode: 'production',
  entry: {
    app: path.join(__dirname, 'client/index.js'),
  },
  output: {
    path: path.resolve(__dirname, 'public'),
    filename: '[name].[hash].js',
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        loader: 'babel-loader',
      },
    ],
  },
};
