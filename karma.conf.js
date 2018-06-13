module.exports = function(config) {
    config.set({
        basePath: '',
        frameworks: ['jasmine'],
        files: [
            'node_modules/jquery/dist/jquery.min.js',
            'node_modules/file-saver/FileSaver.min.js',
            'node_modules/golden-layout/dist/goldenlayout.min.js',
            'node_modules/angular/angular.min.js',
            'node_modules/angular-route/angular-route.min.js',
            'node_modules/lodash/lodash.min.js',
            'vendor/dx.all.js',
            'tests/app.js',
            'dist/gl-dashboard.min.js',
            'tests/plugins/infra/service-layout-test.js',
            'tests/plugins/infra/factory-layout-test.js',
            'tests/plugins/infra/service-widget-default.js',
            // refacto - find a way to make scriptjs work in karma...
            'tests/plugins/modules/test1.js',
            'tests/plugins/modules/test2.js',
            'node_modules/angular-mocks/angular-mocks.js',
            'tests/tests.js',
        ],
        preprocessors: {
            'dist/gl-dashboard.min.js': ['coverage'],
            'tests/plugins/infra/service-layout-test.js': ['babel'],
            'tests/plugins/infra/factory-layout-test.js': ['babel'],
            'tests/plugins/infra/service-widget-default.js': ['babel'],
             // refacto - find a way to make scriptjs work in karma...
            'tests/plugins/modules/test1.js': ['babel'],
            'tests/plugins/modules/test2.js': ['babel'],
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
                { type: 'text-summary' },
                { type: 'lcovonly', subdir: '.' },

            ]
        }
    });
};
