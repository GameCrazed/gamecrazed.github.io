const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const fs = require('fs');

function getHeadTemplate() {
  return fs.readFileSync(path.resolve(__dirname, 'src/components/head.html'), 'utf8');
}

module.exports = {
  entry: {
    databaseHandler: './src/services/database-handler.ts',
    cookieHandler: './src/services/cookie-handler.ts',
    guidHandler: './src/services/guid-handler.ts',
    index: './src/pages/index.ts',
    throwingDistanceCalculator: './src/pages/throwing-distance-calculator.ts',
    measurementsTable: './src/pages/measurements-table.ts',
    advantages: './src/pages/advantages.ts',
    conditions: './src/pages/conditions.ts',
    variablePowersManager: './src/pages/variable-powers-manager.ts',
    navbar: './src/components/navbar.ts'
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
      template: './src/pages/index.html',
      filename: 'index.html',
      chunks: ['index', 'databaseHandler', 'navbar'],
      inject: 'body',
      favicon: './src/assets/favicon.ico',
      templateParameters: {
        head: getHeadTemplate()
      }
    }),
    new HtmlWebpackPlugin({
      template: './src/pages/throwing-distance-calculator.html',
      filename: 'throwing-distance-calculator.html',
      chunks: ['throwingDistanceCalculator', 'navbar'],
      inject: 'body',
      favicon: './src/assets/favicon.ico',
      templateParameters: {
        head: getHeadTemplate()
      }
    }),
    new HtmlWebpackPlugin({
      template: './src/pages/measurements-table.html',
      filename: 'measurements-table.html',
      chunks: ['measurementsTable', 'navbar'],
      inject: 'body',
      favicon: './src/assets/favicon.ico',
      templateParameters: {
        head: getHeadTemplate()
      }
    }),
    new HtmlWebpackPlugin({
      template: './src/pages/advantages.html',
      filename: 'advantages.html',
      chunks: ['advantages', 'navbar'],
      inject: 'body',
      favicon: './src/assets/favicon.ico',
      templateParameters: {
        head: getHeadTemplate()
      }
    }),
    new HtmlWebpackPlugin({
      template: './src/pages/conditions.html',
      filename: 'conditions.html',
      chunks: ['conditions', 'navbar'],
      inject: 'body',
      favicon: './src/assets/favicon.ico',
      templateParameters: {
        head: getHeadTemplate()
      }
    }),
    new HtmlWebpackPlugin({
      template: './src/pages/variable-powers-manager.html',
      filename: 'variable-powers-manager.html',
      chunks: ['variablePowersManager', 'navbar', 'databaseHandler'],
      inject: 'body',
      favicon: './src/assets/favicon.ico',
      templateParameters: {
        head: getHeadTemplate()
      }
    }),
    new MiniCssExtractPlugin({
      filename: '[name].css',
    }),
    new CopyWebpackPlugin({
      patterns: [
        { from: './src/utils/data-store.sqlite3' },
        { from: './src/components/navbar.html' },
        { from: './src/components/head.html' }
      ],
    }),
    new CleanWebpackPlugin()
  ],
};