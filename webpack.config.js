let webpack = require('webpack')
module.exports = {
	entry: {
    bundle: './index.js',
  },
	output: {
		filename: '[name].js'
	},
	module: {
		rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        loader: 'babel-loader',
        query: {
          presets: ['es2015']
        }
      },
      {
  			test: /\.less$/,
  			use: [
  				'style-loader',
  				{
  					loader: 'css-loader',
  					options: {
  						importLoaders: 1
  					}
  				},
  				'less-loader'
  			]
      }
		]
	}
}