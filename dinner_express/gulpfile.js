
// 引入依赖包
var gulp = require('gulp'),
	nodemon = require('gulp-nodemon'),
	browserSync = require('browser-sync').create();
// app.js变化自动重启服务器
gulp.task('nodemon', function (cb) {
    var called = false;
    return nodemon({
                script: 'app.js',
                ext: 'js',
                ignore: ['public/**'],
                env: {'NODE_ENV': 'development'}
    })
    .on('start', function onStart() {
        if(!called){cb();}
            called = true;
        })
    .on('restart', function() {
        setTimeout(function() {
            console.log('-------- restart --------');
        }, 1000);
    });
});
// 静态资源和view变化自动刷新页面
gulp.task('browser-sync', ['nodemon'], function(){
    browserSync.init({
        files: ['public/**','views/**'],
        proxy: 'http://localhost:3000',
        port: 3000,
        notify: true,
    });
});