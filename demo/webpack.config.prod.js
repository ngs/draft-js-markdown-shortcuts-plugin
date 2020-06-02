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
      {
        test: /\.css$/,
        use: ['style-loader', 'css-loader', 'postcss-loader'],
      },
    ],
  },
  devServer: {
    contentBase: [path.join(__dirname, 'public'), path.join(__dirname, 'publicTemplate')],
    port: process.env.PORT || 3001,
  },
};
