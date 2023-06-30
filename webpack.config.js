const path = require("path");

module.exports = {
  mode: "production",
  entry: "./src/index.tsx",
  devtool: "source-map",
  resolve: {
    extensions: [".ts", ".tsx"],
  },
  output: {
    path: path.join(__dirname, "/lib"),
    filename: "[name].js",
    libraryTarget: "commonjs2",
  },
  module: {
    rules: [
      {
        test: /\.ts(x?)$/,
        exclude: /node_modules/,
        use: [
          {
            loader: "ts-loader",
          },
        ],
      },
      {
        enforce: "pre",
        test: /\.js$/,
        loader: "source-map-loader",
      },
    ],
  },
  externals: {
    react: "commonjs react", // this line is just to use the React dependency of our parent-testing-project instead of using our own React.
  },
};
