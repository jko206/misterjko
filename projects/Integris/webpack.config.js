const path = require('path');

module.exports = {
  entry: './src/js/init.js',
  output: {
    filename: 'main.js',
    path: path.resolve(__dirname, 'dist')
  },
  mode: 'development',
};