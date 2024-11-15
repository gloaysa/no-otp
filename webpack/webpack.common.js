const webpack = require('webpack');
const path = require('path');
const CopyPlugin = require('copy-webpack-plugin');
const srcDir = path.join(__dirname, '..', 'src');

module.exports = {
	entry: {
		popup: path.join(srcDir, 'popup.tsx'),
		options: path.join(srcDir, 'options.tsx'),
		index: path.join(srcDir, 'index.ts'),
	},
	output: {
		path: path.join(__dirname, '../plugin/js'),
		filename: '[name].js',
	},
	optimization: {
		splitChunks: false,
	},
	module: {
		rules: [
			{
				test: /\.tsx?$/,
				use: 'ts-loader',
				exclude: /node_modules/,
			},
      {
        test: /\.css$/,
        use: ['style-loader', 'css-loader'],
      },
		],
	},
	resolve: {
		extensions: ['.ts', '.tsx', '.js'],
	},
	plugins: [
		new CopyPlugin({
			patterns: [{ from: '.', to: '../', context: 'public' }],
			options: {},
		}),
	],
};
