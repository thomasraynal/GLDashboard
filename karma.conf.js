module.exports = function(config) {
    config.set({
        basePath: '',
        frameworks: ['jasmine'],
        files: [
            'vendor/jquery-3.1.1.min.js',
            'vendor/FileSaver.min.js',
            'vendor/goldenlayout.min.js',
            'vendor/angular.min.js',
            'vendor/angular-route.min.js',
            'vendor/lodash.min.js',
            'vendor/dx.viz-web.js',
            'dist/gl-dashboard.min.js',
            'tests/plugins/infra/service-layout-test.js',
            'tests/plugins/infra/factory-layout-test.js',
            'tests/plugins/infra/service-widget-default.js',
            'node_modules/angular-mocks/angular-mocks.js',
            'tests/tests.js',
        ],
        preprocessors: {
            'dist/gl-dashboard.min.js': ['coverage'],
            'tests/plugins/infra/service-layout-test.js': ['babel'],
            'tests/plugins/infra/factory-layout-test.js': ['babel'],
            'tests/plugins/infra/service-widget-default.js': ['babel'],
            'tests/tests.js': ['babel']
        },
        babelPreprocessor: {
            options: {
                presets: ['es2015'],
                sourceMap: 'inline',
            },
            filename: function(file) {
                return file.originalPath.replace(/\.js$/, '.es5.js');
            },
            sourceFileName: function(file) {
                return file.originalPath;
            }
        },
        plugins: [
            'karma-jasmine',
            'karma-phantomjs-launcher',
            'karma-coverage',
            'karma-babel-preprocessor'
        ],
        reporters: ['progress', 'coverage'],
        port: 9878,
        colors: true,
        logLevel: config.LOG_DEBUG,
        browsers: ['PhantomJS'],
        singleRun: true,
        concurrency: Infinity,
        coverageReporter: {
            includeAllSources: false,
            dir: 'coverage/',
            reporters: [
                { type: "html", subdir: "html" },
                { type: 'text-summary' }
            ]
        }
    });
};
