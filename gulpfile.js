var gulp = require('gulp'),
    connect = require('gulp-connect'),
    minifyCSS = require('gulp-minify-css'),
    uglify = require('gulp-uglify'),
    concat = require('gulp-concat'),
    ngAnnotate = require('gulp-ng-annotate'),
    templateCache = require('gulp-angular-templatecache'),
    babel = require('gulp-babel'),
    targetDir = './dist',
    path = require('path'),
    headerComment = require('gulp-header-comment');

gulp.task('templates', function() {
    return gulp.src('./src/html/*.html')
        .pipe(templateCache('gl-dashboard-template.js', { module: 'glDashboardTemplates' }))
        .pipe(gulp.dest('./src/js'));
});

gulp.task('css', function() {
    return gulp.src('./src/css/*.css')
        .pipe(concat('gl-dashboard.base.min.css'))
        .pipe(minifyCSS({ 'keepSpecialComments-*': 0 }))
        .pipe(headerComment({
            file: path.join(__dirname, 'version')
        }))
        .pipe(gulp.dest(targetDir))
        .pipe(gulp.dest('demo/css'));
});

gulp.task('themes', function() {
    return gulp.src('./src/themes/*.css')
        .pipe(minifyCSS({ 'keepSpecialComments-*': 0 }))
        .pipe(gulp.dest(targetDir + '/themes'))
        .pipe(gulp.dest('demo/css/themes'));
});

gulp.task('icons', function() {
    return gulp.src('./src/themes/icons/*.*')
        .pipe(gulp.dest(targetDir + '/themes/icons'))
        .pipe(gulp.dest('demo/css/themes/icons'));
});

gulp.task('vendorjs', function() {
    return gulp.src([
            './node_modules/jquery/dist/jquery.min.js',
            './node_modules/scriptjs/dist/script.min.js',
            './node_modules/file-saver/FileSaver.min.js',
            './node_modules/golden-layout/dist/goldenlayout.min.js',
            './node_modules/angular/angular.min.js',
            './node_modules/angular-route/angular-route.min.js',
            './node_modules/lodash/lodash.min.js',
            './vendor/dx.all.js'
        ])
        .pipe(gulp.dest(targetDir + '/vendor'))
        .pipe(concat('vendor.js'))
        .pipe(gulp.dest('demo/js'));
});

gulp.task('vendorcss', function() {
    return gulp.src([
            './vendor/dx.common.css',
            './vendor/dx.spa.css',
            './node_modules/golden-layout/src/css/goldenlayout-base.css'
        ])
        .pipe(gulp.dest(targetDir + '/vendor'))
        .pipe(gulp.dest('demo/css/'));
});

gulp.task('js', function() {
    return gulp.src([
            './src/js/module.js',
            './src/js/*.js'
        ])
        .pipe(babel({
            presets: ['es2015']
        }))
        .pipe(concat('gl-dashboard.min.js'))
        .pipe(ngAnnotate())
        .pipe(uglify())
        .pipe(headerComment({
            file: path.join(__dirname, 'version')
        }))
        .pipe(gulp.dest(targetDir))
        .pipe(gulp.dest('demo/js'));
});

gulp.task('connect', function() {
    connect.server({
        root: './demo',
        livereload: true,
        port: 8484
    });
});

gulp.task('watch', function() {
    gulp.watch(['./src/html/*.html'], ['templates', 'js']);
    gulp.watch(['./src/js/*.js'], ['js']);
    gulp.watch(['./src/css/*.css'], ['css']);
    gulp.watch(['./src/themes/*.css'], ['css']);
});

gulp.task('default', ['css', 'templates', 'js', 'themes', 'icons', 'vendorjs', 'vendorcss', 'watch', 'connect']);
