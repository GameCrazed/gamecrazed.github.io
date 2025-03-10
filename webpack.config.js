const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');

module.exports = {
  entry: {
    main: './src/index.ts',
    myscripts: './src/myscripts.js',
  },
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: '[name].bundle.js',
    publicPath: '',
    library: {
      type: 'module',
    },
    module: true,
  },
  experiments: {
    outputModule: true,
  },
  resolve: {
    extensions: ['.ts', '.js'],
  },
  mode: 'production',
  module: {
    rules: [
      {
        test: /\.ts$/,
        exclude: /node_modules/,
        use: 'ts-loader',
      },
      {
        test: /\.css$/,
        use: [MiniCssExtractPlugin.loader, 'css-loader'],
      },
    ],
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: './index.html',
      filename: 'index.html',
      inject: 'body',
    }),
    new MiniCssExtractPlugin({
      filename: '[name].css',
    }),
  ],
};