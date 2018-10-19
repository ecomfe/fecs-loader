/**
 * @file index.js fecs-loader main file
 * @author zhangzhiqiang<zhiqiangzhang37@gmail.com>
 */

var fecs = require('fecs');
var vfs = require('vinyl-fs');
var cssChecker = require('fecs/lib/css/checker');
var jsChecker = require('fecs/lib/js/checker');
var lessChecker = require('fecs/lib/less/checker');
var htmlChecker = require('fecs/lib/html/checker');
var fecsLog = require('fecs/lib/log');
var fecsReporter = require('fecs/lib/reporter');
var mapStream  = require('map-stream');
var loaderUtils = require('loader-utils');
var assign = require('object-assign');
var glob = require('resolve-glob');
var path = require('path');

/**
 * 错误等级
 *
 * @enum {number}
 */
var Severity = {
    WARN: 1,
    ERROR: 2
};
var excludeFiles;
var fecsOptions = fecs.getOptions();

/**
 * 根据文件类型选用fecs的checker进行check
 *
 * @param  {string} fileType 文件类型描述
 * @param  {Object} options  fecs options
 * @return {module:through2} through2 的转换流
 */
function check(fileType, options) {

    var checker;
    switch (fileType) {
        case 'js':
        case 'es':
        case 'es6':
        case 'jsx':
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

    return checker.exec(options);

}

module.exports = function (resource, map) {

    // 跳过node_modules
    var resourcePath = this.resourcePath;
    if (/node_modules/.test(resourcePath)) {
        return resource;
    }

    // 利用缓存来提高效率
    this.cacheable();
    var callback = this.async();
    var emitError = this.emitError;
    var extName = path.extname(resourcePath).slice(1);
    var log = fecsLog(fecsOptions.color);
    var reporter = fecsReporter.get(log, fecsOptions);
    var source = [resourcePath];
    var checkFileTypes = ['js', 'es', 'es6', 'jsx', 'html', 'css', 'less', 'vue'];
    // match webpack4
    var webpackConfOpt = this.options || {};
    var options = assign(
        {},
        fecsOptions,
        webpackConfOpt.fecs || {},
        loaderUtils.getOptions(this)
    );

    function judgeAndContinue() {
        if (excludeFiles && excludeFiles.indexOf(resourcePath) !== -1) {
            callback(null, resource, map);
        }
    }

    if (options.exclude && typeof options.exclude === 'string') {
        var exclude = options.exclude.split(',');
        if (!excludeFiles) {
            glob(exclude, function (err, files) {
                // 缓存排除文件列表
                excludeFiles = files;
                judgeAndContinue();
            });
        }
        else {
            judgeAndContinue();
        }
        exclude = exclude.map(function (item) {
            return '!' + item;
        });
        // 将排除文件列表排除掉，vfs就不读取了
        source = [resourcePath].concat(exclude);
    }

    // report结束时打个空白行
    reporter.on('done', function (success, json, fileCount, errorCount) {
        /* eslint-disable */
        console.log();
        /* eslint-enable */
    });

    vfs.src(source, {cwdbase: true, allowEmpty: true})
        .pipe(mapStream(function (file, cb) {
            var filePath = file.path;
            // 不在check类型列表的文件使用html规则检查
            if (checkFileTypes.indexOf(extName) === -1) {
                file.realPath = filePath;
                file.path = filePath.slice(0, -path.extname(filePath).length) + '.html';
                // 非html类型文件允许出现css style标签
                var newContents = '<!-- htmlcs-disable css-in-head, style-disabled -->\n'
                    + file.contents.toString();
                file.contents = new Buffer(newContents);
            }
            cb(null, file);
        }))
        .pipe(check(extName, options))
        .pipe(mapStream(function (file, cb) {
            if (file.realPath) {
                file.path = file.realPath;
            }
            cb(null, file);
            var errorCount = 0;
            var warningCount = 0;
            if (file.errors && Array.isArray(file.errors)) {
                file.errors.forEach(function (error) {
                    if (error.severity === Severity.ERROR) {
                        errorCount++;
                    }
                    else if (error.severity === Severity.WARN) {
                        warningCount++;
                    }
                });
            }
            if ((options.failOnError && errorCount)
                || (options.failOnWarning && warningCount)) {
                emitError('Module failed because of fecs '
                    + ((options.failOnError && errorCount) ? 'error' : 'warning')
                    + '.\n');
                resource = '';
            }
            callback(null, resource, map);
        }))
        .pipe(reporter);

};
