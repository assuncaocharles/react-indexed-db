module.exports = function(config) {
	config.set({
		basePath: '',
		frameworks: ['jasmine'],
		files: ['**/*.spec.ts'],
		exclude: ['./node_modules/'],
		preprocessors: {
			'**/*.spec.ts': ['webpack', 'coverage']
		},
		webpack: {
			// karma watches the test entry points
			// (you don't need to specify the entry option)
			// webpack watches dependencies
			resolve: {
				extensions: ['.ts', '.tsx', '.js']
			},
			devtool: 'inline-source-map',
			node: {
				fs: 'empty'
			},
			module: {
				rules: [
					{
						test: /\.tsx?$/,
						loader: 'awesome-typescript-loader'
					}
				]
			}
			// webpack configuration
		},
		coverageReporter: {
			type: 'lcov',
			dir: 'coverage/'
		},
		webpackMiddleware: {
			// webpack-dev-middleware configuration
			// i. e.
			stats: 'errors-only'
		},
		mime: {
			'text/x-typescript': ['ts', 'tsx']
		},
		reporters: ['progress', 'coverage'],
		port: 9876,
		colors: true,
		logLevel: config.LOG_INFO,
		autoWatch: true,
		browsers: ['PhantomJS'],
		singleRun: true,
		concurrency: Infinity
	});
};
