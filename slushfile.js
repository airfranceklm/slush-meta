'use strict';

var gulp = require('gulp');


gulp.task('default', ['project']);

gulp.task('project', require('./src/project')(__dirname));

gulp.task('module', require('./src/module')(__dirname));

gulp.task('controller', require('./src/controller')(__dirname));

gulp.task('service', require('./src/service')(__dirname));

gulp.task('directive', require('./src/directive')(__dirname));

gulp.task('route', require('./src/route')(__dirname));

gulp.task('view', require('./src/view')(__dirname));

gulp.task('mock', require('./src/mock')(__dirname, true));

gulp.task('crud', require('./src/crud')(__dirname));

gulp.task('filter', require('./src/filter')(__dirname));
