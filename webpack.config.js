let webpack = require('webpack')
let devFlagPlugin = new webpack.DefinePlugin({
  __DEV__: process.env.DEBUG || false
})
// vendor common chunk
let commonsPlugin = new webpack.optimize.CommonsChunkPlugin({
  name: 'vendor', 
  filename: 'vendor.js'
})
// make Vue globally available
let providePlugin = new webpack.ProvidePlugin({
  Vue: 'vue'
})
module.exports = {
	entry: {
    // style: './styleInjector.js',
    bundle: './index.js',
    vendor: ['vue']
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
	},
  plugins: [
    // devFlagPlugin,
    commonsPlugin,
    providePlugin
  ],
  resolve: {
    alias: {
      'vue$': 'vue/dist/vue.common.js'
    }
  }
}