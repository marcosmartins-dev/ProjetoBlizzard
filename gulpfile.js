const gulp = require('gulp');
const sass = require('gulp-sass')(require('sass'));
const autoprefixer = require('gulp-autoprefixer');
const browserSync = require('browser-sync').create();
const concat = require('gulp-concat');
const babel = require('gulp-babel');
const uglify = require('gulp-uglify');

// Compilando o Sass, adicionando auto-prefixer e dando refresh na página
function SassCompiler() {
    return gulp.src('scss/*.scss')
    .pipe(sass({outputStyle : 'compressed'}))
    .pipe(autoprefixer({
        overrideBrowserslist: ['last 2 versions'],
        cascade: false,
    }))
    .pipe(gulp.dest('css/'))
    .pipe(browserSync.stream());
}

// Tarefa do Sass
gulp.task('sass', SassCompiler);

// Função Plugins CSS
function pluginsCSS() {
    return gulp.src('css/lib/*.css')
    .pipe(concat('plugins.css'))
    .pipe(gulp.dest('css/'))
    .pipe(browserSync.stream());
}

// Tarefa Plugins CSS
gulp.task('pluginscss', pluginsCSS);

// Concatenando arquivos de Scripts JS
function gulpJs() {
    return gulp.src('js/scripts/*.js')
    .pipe(concat('all.js'))
    .pipe(babel({
        presets: ['@babel/env']
    }))
    .pipe(uglify())
    .pipe(gulp.dest('js/'))
    .pipe(browserSync.stream());
}

// Tarefa dos Scripts JS
gulp.task('allJs', gulpJs);

// Funcão Plugins JS
function pluginsJs() {
    return gulp
    //.src(['./js/lib/aos.min.js', './js/lib/swiper.min.js'])
    .src('js/lib/*.js')
    .pipe(concat('plugins.js'))
    .pipe(gulp.dest('js/'))
    .pipe(browserSync.stream());
}

// Tarefa Plugins JS
gulp.task('pluginjs', pluginsJs);

// Função do browserSync
function browser() {
    browserSync.init({
        server: {
            baseDir: './'
        }
    })
}

// Tarefa do browserSync
gulp.task('browser-sync', browser);

// Função do Watch para alterações nos arquivos
function watch() {
    gulp.watch('scss/*.scss', SassCompiler);
    gulp.watch('css/lib/*.css', pluginsCSS);
    gulp.watch('*.html').on('change', browserSync.reload);
    gulp.watch('js/scripts/*.js', gulpJs);
    gulp.watch('js/lib/*.js', pluginsJs);
}

// Tarefa do Watch
gulp.task('watch', watch);

// Tarefa default que executa o watch, browserSync, Sass e JS
gulp.task('default', gulp.parallel('watch', 'browser-sync', 'sass', 'pluginscss', 'allJs', 'pluginjs'));