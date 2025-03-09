module.exports = {
  entry: "./index.ts",
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        use: "ts-loader",
        exclude: /node_modules/,
      },
    ],
  },
  resolve: {
    extensions: [".tsx", ".ts", ".js"],
  },
  output: {
    filename: "bundle.js",
    path: __dirname + "/dist",
    library: {
      type: "module",
    },
  },
  experiments: {
    outputModule: true,
  },
  devServer: {
    contentBase: __dirname + "/dist",
    publicPath: "/dist",
    index: 'index.html',
  },
};