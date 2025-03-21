const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');

module.exports = {
  entry: {
    databaseHandler: './src/database-handler.ts',
    cookieHandler: './src/cookie-handler.ts',
    guidHandler: './src/guid-handler.ts',
    index: './src/index.ts',
    throwingDistanceCalculator: './src/throwing-distance-calculator.ts',
    measurementsTable: './src/measurements-table.ts',
    advantages: './src/advantages.ts',
    conditions: './src/conditions.ts',
    variablePowersManager: './src/variable-powers-manager.ts',
    loadNavbar: './src/load-navbar.ts',
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
      template: './html/index.html',
      filename: 'index.html',
      chunks: ['index', 'databaseHandler', 'loadNavbar'],
      inject: 'body',
      favicon: './Assets/favicon.ico',
    }),
    new HtmlWebpackPlugin({
      template: './html/throwing-distance-calculator.html',
      filename: 'throwing-distance-calculator.html',
      chunks: ['throwingDistanceCalculator', 'loadNavbar'],
      inject: 'body',
      favicon: './Assets/favicon.ico',
    }),
    new HtmlWebpackPlugin({
      template: './html/measurements-table.html',
      filename: 'measurements-table.html',
      chunks: ['measurementsTable', 'loadNavbar'],
      inject: 'body',
      favicon: './Assets/favicon.ico',
    }),
    new HtmlWebpackPlugin({
      template: './html/advantages.html',
      filename: 'advantages.html',
      chunks: ['advantages', 'loadNavbar'],
      inject: 'body',
      favicon: './Assets/favicon.ico',
    }),
    new HtmlWebpackPlugin({
      template: './html/conditions.html',
      filename: 'conditions.html',
      chunks: ['conditions', 'loadNavbar'],
      inject: 'body',
      favicon: './Assets/favicon.ico',
    }),
    new HtmlWebpackPlugin({
      template: './html/variable-powers-manager.html',
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
        { from: 'MandMDataStore.sqlite3' },
        { from: './html/navbar.html' },
      ],
    }),
    new CleanWebpackPlugin()
  ],
};