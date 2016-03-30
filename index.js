/**
 * @file index.js fecs-loader main file
 * @author zhangzhiqiang<zhangzhiqiang04@baidu.com>
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
    console.log('/Users/zhangzhiqiang/work/webpack/less.css')
    switch (fileType) {
        case 'js':
            return jsChecker.exec(options);
            break;
        case 'css':
            return cssChecker.exec(options);
            break;
        case 'less':
            return lessChecker.exec(options);
            break;
        default:
            return jsChecker.exec(options);
            break;
    }

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
