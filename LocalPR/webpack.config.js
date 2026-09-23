const path = require('path');

module.exports = {
  mode: 'development',
  entry: './src/main.ts',
  output: {
    filename: 'bundle.js',
    path: path.resolve(__dirname, 'dist'),
    clean: true,
  },
  devtool: 'source-map',
  resolve: {
    extensions: ['.ts', '.js', '.mujs']
  },
  devServer: {
    static: {
      directory: path.join(__dirname, 'public'),
    },
    port: 1016,
    open: true,
    hot: true,
    historyApiFallback: true,
    proxy: [
      {
        context: ['/api'],
        target: 'http://localhost:1017',
        changeOrigin: true,
      }
    ],
  },
  module: {
    rules: [
      { test: /\.tsx?$/, use: 'ts-loader', exclude: /node_modules/ },
      { test: /\.mujs$/, use: '@mulanjs/mulanjs/loader' },
      { test: /.s[ac]ss$/i, use: ["style-loader", "css-loader", "sass-loader"] },
      { test: /\.css$/i, use: ["style-loader", "css-loader"] },
    ],
  },
};