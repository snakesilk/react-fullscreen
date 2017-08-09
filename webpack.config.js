const path = require('path');
const webpack = require('webpack');

function resolve(...args) {
  return path.resolve(__dirname, ...args);
}

const config = {
  entry: {
    'fullscreen': resolve('src', 'FullScreen.jsx'),
  },
  output: {
    path: resolve('dist'),
    library: 'fullscreen',
    libraryTarget: 'commonjs2',
    filename: `index.js`,
  },
  externals: {
      "react": "react",
      "prop-types": "prop-types",
  },
  module: {
    rules: [
      {
        test: /\.jsx$/,
        include: [
          resolve('src'),
        ],
        use: {
          loader: 'babel-loader',
          options: {
            presets: ['env', 'react'],
            plugins: [
              'transform-class-properties',
            ],
          },
        },
      },
    ],
  },
  plugins: [],
};

module.exports = config;
