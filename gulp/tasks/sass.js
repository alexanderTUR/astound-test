import gulp from 'gulp';
import sass from 'gulp-sass';
import sourcemaps from 'gulp-sourcemaps';
import postcss from 'gulp-postcss';
import autoprefixer from 'autoprefixer';
import postcssSortMediaQueries from 'postcss-sort-media-queries';
import flexFix from 'postcss-flexbugs-fixes';
import smoothScroll from 'postcss-momentum-scrolling';
import postcssAspectRatio from 'postcss-aspect-ratio';
import postcssColorMod from 'postcss-color-mod-function';
import rgb from 'postcss-rgb';
import cssDeclarationSorter from 'css-declaration-sorter';
import postcssNormalize from 'postcss-normalize';
import postcssTriangle from 'postcss-triangle';
import cssnano from 'cssnano';
import gulpif from 'gulp-if';
import rename from 'gulp-rename';
import lazypipe from 'lazypipe';
import rev from 'gulp-rev';
import config from '../config';

// Post-CSS plugins array
const processors = [
  // use the parts of normalize.css or sanitize.css that you need from your browserslist
  postcssNormalize(),
  // create three different types of CSS-triangles
  postcssTriangle(),
  // auto fix some flex-box issues
  flexFix(),
  // auto adds -webkit-overflow-scrolling: touch to all stylechangeds with overflow: scroll for smooth scroll on iOS
  smoothScroll(),
  // adds aspect ratio to elements (example - aspect-ratio: '16:9')
  postcssAspectRatio(),
  // adds color functions (example - color(red a(90%))
  postcssColorMod(),
  // use rgb and rgba with hex values
  rgb(),
  // auto sort css rules in 'SMACSS' order
  cssDeclarationSorter({ order: 'smacss' }),
  // auto adds vendor prefixes
  autoprefixer(),
];

// production pipes
const prodPipes = lazypipe()
  // minify CSS
  .pipe(postcss, [cssnano()])
  // if revision == true: add hash number to your CSS files names
  .pipe(function () {
    return gulpif(config.revision, rev());
  });

const renderCss = () => {
  return (
    gulp
      // take all SASS/SCSS files
      .src(`${config.src.sass}/*.{sass,scss}`)
      // if development: init sourcemaps
      .pipe(gulpif(!config.production, sourcemaps.init({ loadMaps: true })))
      // compile SASS
      .pipe(
        sass({
          outputStyle: config.production ? 'compact' : 'expanded', // nested, expanded, compact, compressed
          precision: 5,
        })
      )
      // error handler
      .on('error', config.errorHandler)
      // apply postcss plugins
      .pipe(postcss(processors))
      // pack/sort all media queries
      .pipe(
        postcss([
          postcssSortMediaQueries({
            // sort: 'mobile-first' default value
            // sort: 'desktop-first'
          }),
        ])
      )
      // rename file with .min suffix
      .pipe(rename({ suffix: '.min' }))
      // if production: run production pipes
      .pipe(gulpif(config.production, prodPipes()))
      // if development: write sourcemaps
      .pipe(gulpif(!config.production, sourcemaps.write()))
      // put result to destination folder
      .pipe(gulp.dest(config.dest.css))
      // if revision == true: write old and new files names to manifest.json
      .pipe(
        rev.manifest(config.revManifest, {
          base: './',
          merge: true, // merge with the existing manifest (if one exists)
        })
      )
      .pipe(gulp.dest('./'))
  );
};

gulp.task('sass', () => renderCss());

const build = (gulp) => gulp.series('sass');
const watch = (gulp) => () =>
  gulp.watch(`${config.src.sass}/**/*.{sass,scss}`, gulp.series('sass'));

module.exports.build = build;
module.exports.watch = watch;
