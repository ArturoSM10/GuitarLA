const {src, dest, watch, series} = require('gulp');
const sass = require('gulp-sass')(require('sass'));
const postcss = require('gulp-postcss');
const autoprefixer = require('autoprefixer');
const cssnano = require('cssnano');

const imagemin = require('gulp-imagemin');
const webp = require('gulp-webp');
const avif = require('gulp-avif');
const { imagenes } = require('../DeliveryApp/gulpfile');


function css(done) {
    src('./scr/scss/app.scss', {sourcemaps: true})
    .pipe(sass({outputStyle: 'expanded'}))
    .pipe(postcss([autoprefixer(), cssnano()]))
    .pipe(dest('./build/css', {sourcemaps: '.'}));
    done();
}

function dev(done) {
    watch('./src/scss/**/*.scss', css);
    watch('./src/img/**/*', imagenes);
}

function imagenes() {
    return src('./src/img/**/*')
    .pipe(imagemin({optimizationLevel: 3}))
    .pipe('./build/img');
}

function versionWebp() {
    return src('./src/img/**/*.{jpg, png}')
    .pipe(webp({quality: 50}))
    .pipe('./build/img');
}

function versionAvif() {
    return src('./src/img/**/*.{jpg, png}')
    .pipe(avif({quality: 50}))
    .pipe('./build/img');
}


exports.css = css;
exports.dev = dev;
exports.imagenes = series(imagenes, versionWebp, versionAvif);
exports.default = series(css, dev);
