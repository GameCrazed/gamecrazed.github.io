const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');

module.exports = {
  entry: {
    databaseHandler: './src/database-handler.ts',
    index: './src/index.js',
    cookieHandler: './src/cookie-handler.js',
    throwingDistanceCalculator: './src/throwing-distance-calculator.js',
    measurementsTable: './src/measurements-table.js',
    advantages: './src/advantages.js',
    conditions: './src/conditions.js',
    variablePowersManager: './src/variable-powers-manager.js',
    loadNavbar: './src/load-navbar.js',
  },
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: '[name].bundle.js',
    publicPath: '',
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
        test: /\.js$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: ['@babel/preset-env'],
          },
        },
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
      chunks: ['index', 'databaseHandler', 'loadNavbar'],
      inject: 'body',
      favicon: './Assets/favicon.ico',
    }),
    new HtmlWebpackPlugin({
      template: './throwing-distance-calculator.html',
      filename: 'throwing-distance-calculator.html',
      chunks: ['throwingDistanceCalculator', 'loadNavbar'],
      inject: 'body',
      favicon: './Assets/favicon.ico',
    }),
    new HtmlWebpackPlugin({
      template: './measurements-table.html',
      filename: 'measurements-table.html',
      chunks: ['measurementsTable', 'loadNavbar'],
      inject: 'body',
      favicon: './Assets/favicon.ico',
    }),
    new HtmlWebpackPlugin({
      template: './advantages.html',
      filename: 'advantages.html',
      chunks: ['advantages', 'loadNavbar'],
      inject: 'body',
      favicon: './Assets/favicon.ico',
    }),
    new HtmlWebpackPlugin({
      template: './conditions.html',
      filename: 'conditions.html',
      chunks: ['conditions', 'loadNavbar'],
      inject: 'body',
      favicon: './Assets/favicon.ico',
    }),
    new HtmlWebpackPlugin({
      template: './variable-powers-manager.html',
      filename: 'variable-powers-manager.html',
      chunks: ['variablePowersManager', 'loadNavbar', 'databaseHandler'],
      inject: 'body',
      favicon: './Assets/favicon.ico',
    }),
    new MiniCssExtractPlugin({
      filename: '[name].css',
    }),
    new CopyWebpackPlugin({
      patterns: [
        { from: 'MandMDataStore.sqlite3'},
        { from: 'navbar.html'}
      ],
    }),
  ],
};