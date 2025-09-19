var gulp = require('gulp');
var concat = require('gulp-concat');
var uglify = require('gulp-uglify');
var rename = require('gulp-rename');
var cleanCSS = require('gulp-clean-css');
var header = require('gulp-header');
var date = new Date();

// js/dest/epointall.min.js
gulp.task('epoint_prod', function() {
	return gulp.src('./js/epoint/epoint.js')
		.pipe(uglify())
		 // 压缩时进行异常捕获
        .on('error', function(err) {
            console.log('line number: %d, message: %s', err.lineNumber, err.message);
            this.end();
        })
		.pipe(rename({
			suffix: '.min'
		}))
		.pipe(gulp.dest('./js/dist/'));
});

// js/dest/miniui.js
gulp.task('miniui_dev', function() {
    return gulp.src([
        './js/miniui/miniui.js',
       
        './js/miniui/ext/CheckBoxList.js',
        './js/miniui/ext/RadioButtonList.js',
        './js/miniui/ext/DataGrid.js',
        './js/miniui/ext/Tree.js',
        './js/miniui/ext/TreeGrid.js',
        './js/miniui/ext/PageTree.js',
        './js/miniui/ext/DataExport.js',
        './js/miniui/ext/Output.js',
        './js/miniui/ext/FilterTree.js',
        './js/miniui/ext/TreeSelect.js',
        './js/miniui/ext/TabsTreeSelect.js',
        './js/miniui/ext/WebUploader.js',
        './js/miniui/ext/LargeFileUploader.js',
        './js/miniui/ext/WebEditor.js',
        './js/miniui/ext/Window.js',
        './js/miniui/ext/PanelTip.js',
        './js/miniui/ext/VerifyCode.js',
        './js/miniui/ext/UserControl.js',
        './js/miniui/ext/extra.js'
    ])
    .pipe(concat('miniui.js')) 
    .pipe(gulp.dest('./js/dist/'));
});

// js/dest/miniui.mini.js
gulp.task('miniui_prod', ['miniui_dev'], function() {
    return gulp.src('./js/dist/miniui.js')
        .pipe(uglify({
            // preserveComments: 'license'
            output: {
                comments: /^@license/i
            }
        }))
         // 压缩时进行异常捕获
        .on('error', function(err) {
            console.log('line number: %d, message: %s', err.lineNumber, err.message);
            this.end();
        })
        .pipe(rename({
            suffix: '.min'
        }))
        .pipe(gulp.dest('./js/dist/'));
});

// js/common/common.js
gulp.task('comm_concat', function(){
	return gulp.src([
		'./js/common/common.util.js',
		'./js/common/common.leftright.js',
		'./js/common/common.form.js',
		'./js/common/common.contentpage.content.js',
		'./js/common/common.contentpage.condition.js',
		'./js/common/common.contentpage.notice.js',
		'./js/common/common.contentpage.advancedsearch.js',
		'./js/common/common.accordions.js',
		'./js/common/common.master.js',
		'./js/common/common.extend.js'
	])
	.pipe(concat('common.js'))
	.pipe(gulp.dest('./js/common/'));
});


// js/dest/common.min.js
// js/dest/common.dto.min.js
gulp.task('comm_uglify', ['comm_concat'], function() {
	return gulp.src([
		'./js/common/common.js',
		'./js/common/common.dto.js'
	])
	.pipe(uglify())
	 // 压缩时进行异常捕获
        .on('error', function(err) {
            console.log('line number: %d, message: %s', err.lineNumber, err.message);
            this.end();
        })
	.pipe(rename({
		suffix: '.min'
	}))
	.pipe(gulp.dest('./js/dist/'));
});

// js/dest/fui.min.js
gulp.task('fui_prod', ['libs_prod', 'miniui_prod'], function() {
	var arr = [
		'dist/libs',

		'dist/miniui'
	];

	var srcArr = arr.map(function(item) {
		return ('./js/' + item + '.min.js');
	});

	return gulp.src(srcArr)
		.pipe(concat('fui.min.js'))
		.pipe(header('/* fui.js ' + date.toLocaleString() + ' */\n'))
		.pipe(gulp.dest('./js/dist/'));
});

// js/dest/frame.min.js
gulp.task('frame_prod', ['comm_uglify', 'epoint_prod'], function() {
	var arr = [
		'dist/common',
		'dist/common.dto',
		'dist/epoint'
	];

	var srcArr = arr.map(function(item) {
		return ('./js/' + item + '.min.js');
	});

	return gulp.src(srcArr)
		.pipe(concat('frame.min.js'))
		.pipe(header('/* frame.js ' + date.toLocaleString() + ' */\n'))
		.pipe(gulp.dest('./js/dist/'));
});

//js/dest/libs.min.js
gulp.task('libs_prod', function() {
	var arr = [
		'libs/jquery-1.11.1.min',
		'libs/jquery-ui.min',
		'libs/atmosphere.min',
		'libs/mustache.min',
		'libs/jquery.cookie.min'
	];

	var srcArr = arr.map(function(item) {
		return ('./js/' + item + '.js');
	});

	return gulp.src(srcArr)
		.pipe(concat('libs.min.js'))
		.pipe(gulp.dest('./js/dist/'));
});

//js/dest/frame.js
gulp.task('frame_dev', ['comm_concat'], function() {
	var arr = [
		'common/common',
		'common/common.dto',
		'epoint/epoint'
	];

	var srcArr = arr.map(function(item) {
		return ('./js/' + item + '.js');
	});

	return gulp.src(srcArr)
		.pipe(concat('frame.js'))
		.pipe(header('/* frame.js ' + date.toLocaleString() + ' */\n'))
		.pipe(gulp.dest('./js/dist/'));
});

gulp.task('concat_common_css', function(){
	return gulp.src([
		'./css/common/common.reset.css',
		'./css/common/common.util.css',
		'./css/common/common.form.css',
		'./css/common/common.accordions.css',
		'./css/common/common.leftright.css',
		'./css/common/common.contentpage.css',
		'./css/common/common.others.css'
	])
	.pipe(concat('common.css'))
	.pipe(gulp.dest('./css/'));
});

gulp.task('minify_common_css', ['concat_common_css'], function(){	
	return gulp.src(['./css/*.css', '!./css/*min.css'])
		.pipe(cleanCSS({compatibility: 'ie8'}))
		.pipe(rename({
			suffix: '.min'
		}))
		.pipe(gulp.dest('./css/'));
});

gulp.task('minify_page_css', function(){	
	return gulp.src(['./pages/**/*.css', '!./pages/**/*min.css', '!./pages/**/skin.css'])
		.pipe(cleanCSS({compatibility: 'ie8'}))
		.pipe(rename({
			suffix: '.min'
		}))
		.pipe(gulp.dest('./pages/'));
});

gulp.task('minify_page_js', function(){	
	return gulp.src(['./pages/**/*.js', '!./pages/**/*min.js', '!./pages/**/test/*.js'])
		.pipe(uglify())
		 // 压缩时进行异常捕获
	        .on('error', function(err) {
	            console.log('line number: %d, message: %s', err.lineNumber, err.message);
	            this.end();
	        })
		.pipe(rename({
			suffix: '.min'
		}))
		.pipe(gulp.dest('./pages/'));
});

gulp.task('main_dev', ['libs_prod', 'miniui_dev', 'frame_dev']);
gulp.task('main_prod', ['fui_prod', 'frame_prod']);

gulp.task('minify', ['minify_common_css', 'minify_page_css', 'minify_page_js']);
gulp.task('default', ['main_dev', 'main_prod']);

gulp.task('all', ['minify', 'default']);
