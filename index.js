/**
 * @file index.js fecs-loader main file
 * @author zhangzhiqiang<zhiqiangzhang37@gmail.com>
 */

var fecs = require('fecs');
var fs = require('vinyl-fs');
var cssChecker = require('fecs/lib/css/checker');
var jsChecker = require('fecs/lib/js/checker');
var lessChecker = require('fecs/lib/less/checker');
var htmlChecker = require('fecs/lib/html/checker');
var fecsLog = require('fecs/lib/log');
var fecsReporter = require('fecs/lib/reporter');
var mapStream  = require('map-stream');
var path = require('path');
// var util = require('util');

var options = fecs.getOptions();

function check(fileType) {
    var checker;
    switch (fileType) {
        case 'js':
            checker = jsChecker;
            break;
        case 'css':
            checker = cssChecker;
            break;
        case 'less':
            checker = lessChecker;
            break;
        default:
            checker = htmlChecker;
            break;
    }

    // return checker.check(contents, filePath, options);
    return checker.exec(options);

}

module.exports = function (resource) {

    // 利用缓存来提高效率
    this.cacheable();

    var resourcePath = this.resourcePath;
    var extName = path.extname(resourcePath).slice(1);
    var log = fecsLog(options.color);
    var reporter = fecsReporter.get(log, options);

    // report结束时打个空白行
    reporter.on('done', function (success, json, fileCount, errorCount) {
        /* eslint-disable */
        console.log();
        /* eslint-enable */
    });

    fs.src([resourcePath])
        // .pipe(mapStream(function (file, cb) {
        //     var contents = file.contents.toString();
        //     var done = function (errors) {
        //         file.errors = errors;
        //         cb(null, file);
        //     };
        //     var promise = check(extName, contents, file.path);
        //     if (util.isArray(promise)) {
        //         return done(promise);
        //     }
        //     promise.then(done, done);
        // }))
        .pipe(mapStream(function (file, cb) {
            var filePath = file.path;
            if (extName !== 'js' && extName !== 'css' && extName !== 'less') {
                file.realPath = filePath;
                file.path = filePath.slice(0, -path.extname(filePath).length) + '.html';
            }
            cb(null, file);
        }))
        .pipe(check(extName))
        .pipe(mapStream(function (file, cb) {
            if (file.realPath) {
                file.path = file.realPath;
            }
            cb(null, file);
        }))
        .pipe(reporter);

    return resource;

};
