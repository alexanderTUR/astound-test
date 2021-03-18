import gulp from 'gulp';
import sourcemaps from 'gulp-sourcemaps';
import babel from 'gulp-babel';
import concat from 'gulp-concat';
import gulpif from 'gulp-if';
import terser from 'gulp-terser';
import lazypipe from 'lazypipe';
import rename from 'gulp-rename';
import rev from 'gulp-rev';
import config from '../config';

// production pipes
const prodPipes = lazypipe()
  // minify JS
  .pipe(terser)
  // if revision == true: add hash number to your JS files names
  .pipe(function () {
    return gulpif(config.revision, rev());
  });

gulp.task('js:bundle', () =>
  gulp
    // take JS libraries files you need
    .src([
      //  - Swiper slider - https://swiperjs.com/)
      `${config.nodeModules}/swiper/swiper-bundle.js`,
      //  - Micromodal plugin (lightweight modal - https://micromodal.now.sh/)
      `${config.nodeModules}/micromodal/dist/micromodal.js`,
    ])
    // error handler
    .on('error', config.errorHandler)
    // if development: init sourcemaps
    .pipe(gulpif(!config.production, sourcemaps.init({ loadMaps: true })))
    // concatenate library JS files in one bundle JS file, and rename it to bundle.js
    .pipe(concat('bundle.js'))
    // rename file with .min suffix
    .pipe(rename({ suffix: '.min' }))
    // if production: run production pipes
    .pipe(gulpif(config.production, prodPipes()))
    // if development: write sourcemaps
    .pipe(gulpif(!config.production, sourcemaps.write()))
    // put result to destination folder
    .pipe(gulp.dest(config.dest.js))
    // if revision == true: write old and new files names to manifest.json
    .pipe(
      rev.manifest(config.revManifest, {
        base: './',
        merge: true, // merge with the existing manifest (if one exists)
      })
    )
    .pipe(gulp.dest('./'))
);

gulp.task('js:main', () =>
  gulp
    // take you custom JS files
    .src(`${config.src.js}/*.js`)
    // if development: init sourcemaps
    .pipe(gulpif(!config.production, sourcemaps.init({ loadMaps: true })))
    // rename file with .min suffix
    .pipe(rename({ suffix: '.min' }))
    // convert modern JS syntax to older
    .pipe(
      babel({
        presets: ['@babel/env'],
      })
    )
    // if production: run production pipes
    .pipe(gulpif(config.production, prodPipes()))
    // if development: write sourcemaps
    .pipe(gulpif(!config.production, sourcemaps.write()))
    // put result to destination folder
    .pipe(gulp.dest(config.dest.js))
    // if revision == true: write old and new files names to manifest.json
    .pipe(
      rev.manifest(config.revManifest, {
        base: './',
        merge: true, // merge with the existing manifest (if one exists)
      })
    )
    .pipe(gulp.dest('./'))
);

const build = (gulp) => gulp.series('js:bundle', 'js:main');
const watch = (gulp) => () =>
  gulp.watch(`${config.src.js}/**/*.js`, gulp.series('js:bundle', 'js:main'));

module.exports.build = build;
module.exports.watch = watch;
