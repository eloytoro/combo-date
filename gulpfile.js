var gulp = require('gulp'),
    merge = require('merge-stream'),
    filesort = require('gulp-angular-filesort'),
    concat = require('gulp-concat'),
    templateCache = require('gulp-angular-templatecache');

var globs = {
    templates: 'assets/templates/*.html',
    js: 'assets/js/*.js',
    main: 'dist/'
};

gulp.task('build', function () {
    var templates = gulp.src(globs.templates)
        .pipe(templateCache({
            module: 'combo-date',
            root: 'combo-date/templates'
        }));
    var js = gulp.src(globs.js);
    merge(templates, js)
        .pipe(filesort())
        .pipe(concat('combo-date.js'))
        .pipe(gulp.dest(globs.main));
});
