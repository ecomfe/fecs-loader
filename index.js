/**
 * @file index.js fecs-loader main file
 * @author zhangzhiqiang<zhiqiangzhang37@gmail.com>
 */

// var loaderUtils = require('loader-utils');
var fecs = require('fecs');
var fs = require('vinyl-fs');
var cssChecker = require('fecs/lib/css/checker');
var jsChecker = require('fecs/lib/js/checker');
var lessChecker = require('fecs/lib/less/checker');
var fecsLog = require('fecs/lib/log');
var fecsReporter = require('fecs/lib/reporter');
var path = require('path');

var options = fecs.getOptions();

function check(fileType, options) {
    var checker;
    switch (fileType) {
        case 'js':
            checker = jsChecker.exec(options);
            break;
        case 'css':
            checker = cssChecker.exec(options);
            break;
        case 'less':
            checker = lessChecker.exec(options);
            break;
        default:
            checker = jsChecker.exec(options);
            break;
    }

    return checker;

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
        console.log();
    });


    fs.src([resourcePath])
        .pipe(check(extName, options))
        .pipe(reporter);

    return resource;

};
