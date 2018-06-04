'use strict'

// import modules
const gulp = require('gulp')
const sass = require('gulp-sass')
const rename = require('gulp-rename')
const minify_css = require('gulp-minify-css')
const uglify = require('gulp-uglify')
const browserify = require('browserify')
const babel = require('babelify')
const source = require('vinyl-source-stream')
const buffer = require('vinyl-buffer')

// specify tasks

// styles
gulp.task('styles', () => {
	gulp
		.src('index.scss')
		.pipe(sass())
		.pipe(rename('main.min.css'))
		.pipe(minify_css())
		.pipe(gulp.dest('assets/css'))
})

// scripts
gulp.task('scripts', () => {
	browserify('src/index.js')
		.transform(babel, {
			presets: ['es2015'],
			plugins: ['syntax-async-functions', 'transform-regenerator']
		})
		.bundle()
		.pipe(source('index.js'))
		.pipe(buffer())
		.pipe(uglify())
		.pipe(rename('main.min.js'))
		.pipe(gulp.dest('assets/scripts'))
})

// Default tasks
gulp.task('default', ['styles', 'scripts'])
